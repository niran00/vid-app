const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');

// Database details 
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test-backup',
  password: 'postgres',
  port: 5433, // default PostgreSQL port
});

// Generate a secret key
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(`Secret key: ${secretKey}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files


// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT id FROM users WHERE email = $1 AND password = $2', [email, password]);
      const user = result.rows[0];
  
      if (user) {
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
        console.log("Token generated:", token);
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
        console.log("Failed login attempt");
      }
  
      client.release();
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // 100 MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('file'); // Ensure this matches the field name in Postman

// Check file type
function checkFileType(file, cb) {
    const filetypes = /mp4|mov|avi|mkv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Videos Only!');
    }
  }

// Video upload route
app.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        res.status(400).send({ message: err });
      } else {
        if (req.file == undefined) {
          res.status(400).send({ message: 'No file selected' });
        } else {
          const { filename, originalname, mimetype, size } = req.file;
          try {
            const client = await pool.connect();
            await client.query('INSERT INTO videos (name, type, size) VALUES ($1, $2, $3)', [originalname, mimetype, size]);
            client.release();
            res.send({ message: 'File uploaded successfully', file: `uploads/${filename}`,  title: `${filename}` });
          } catch (err) {
            console.error("Error inserting video details:", err);
            res.status(500).json({ message: 'Internal server error' });
          }
        }
      }
    });
  });
  

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

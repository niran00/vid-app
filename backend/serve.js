const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

// Generate a secret key
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(`Secret key: ${secretKey}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// Mock user data (replace with your actual user authentication logic)
const users = [
  { id: 1, email: 'niran.millet@gmail.com', password: 'password' } // Dummy user for demonstration
];

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    try {
      const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
      res.json({ token });
      console.log("Token generated:", token);
    } catch (err) {
      console.error("Error generating token:", err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
    console.log("Failed login attempt");
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
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).send({ message: 'No file selected' });
      } else {
        res.send({ message: 'File uploaded successfully', file: `uploads/${req.file.filename}`,  title: `${req.file.filename}` });
      }
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

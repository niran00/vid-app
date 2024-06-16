# Getting started 

Run npm install in this current directory. 

## Starting Angular 

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. 
You should see our frontend working in the browsers. 

## Setting up the the database. 
Create a new database in postgres (I named mine demo-db). 
Use the dbBk.sql in this directory, to restore your newly created database.

## Connecting the database to the backend. 
Inside, /backend/serve.js and search for "Database details"

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'demo-db',
  password: 'postgres',
  port: 5433, 
  <!-- Default port is 5432 -->
});

These are the configuration I used on machine, however the default port for postgres is 5432. 

## Starting up the backend. 
In your terminal, navigate to backend and run npm install. 
Once that is complete you can run " node serve.js " the backend will begin to run on port 3000. 




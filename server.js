const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Cấu hình PostgreSQL
const client = new Client({
  host: 'localhost',      // hoặc IP DB
  port: 5432,              // mặc định PostgreSQL
  user: 'postgres',       // thay bằng user thật
  password: '1234',   // thay bằng pass thật
  database: 'huongle'      // thay bằng DB name
});

client.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ Connection error', err.stack));

// Tạo bảng ví dụ nếu chưa có (users)
client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  );
`);

// --------- ROUTES -----------
// GET all users
app.get('/data', (req, res) => {
  client.query('SELECT * FROM actual_table_name', (err, result) => {
      if (err) {
          console.error('Error executing query', err.stack);
          res.status(500).send('Error executing query');
      } else {
          res.status(200).json(result.rows);
      }
  });
});

// CREATE user
app.post('/data', (req, res) => {
  const { column1, column2 } = req.body; // Lấy dữ liệu từ body của yêu cầu
  client.query('INSERT INTO actual_table_name (column1, column2) VALUES ($1, $2)', [column1, column2], (err, result) => {
      if (err) {
          console.error('Error inserting data', err.stack);
          res.status(500).send('Error inserting data');
      } else {
          res.status(201).send('Data added successfully');
      }
  });
});
// UPDATE user
app.put('/data/:id', (req, res) => {
  const { id } = req.params; // Lấy id từ URL
  const { column1, column2 } = req.body; // Lấy dữ liệu từ body
  client.query('UPDATE actual_table_name SET column1 = $1, column2 = $2 WHERE id = $3', [column1, column2, id], (err, result) => {
      if (err) {
          console.error('Error updating data', err.stack);
          res.status(500).send('Error updating data');
      } else {
          res.status(200).send('Data updated successfully');
      }
  });
});

// DELETE user
app.delete('/data/:id', (req, res) => {
  const { id } = req.params; // Lấy id từ URL
  client.query('DELETE FROM actual_table_name WHERE id = $1', [id], (err, result) => {
      if (err) {
          console.error('Error deleting data', err.stack);
          res.status(500).send('Error deleting data');
      } else {
          res.status(200).send('Data deleted successfully');
      }
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});

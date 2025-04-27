const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Monu@1234",
  database: "sakila",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed", err.stack);
    return;
  }
  console.log("Connected to database");
});

router.get("/fetch", (req, res) => {
  const sql = "SELECT film_id, title, description, length, rating FROM film";
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

router.post("/search", (req, res) => {
  const payload = req.body.title;
  const sql = "SELECT * FROM film WHERE UPPER(title) LIKE CONCAT('%', ?, '%')";
  db.query(sql, [payload], (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

router.post("/add", (req, res) => {
  const title = req.body.newFilm.title;
  const description = req.body.newFilm.description;
  const length = req.body.newFilm.length;
  const rating = req.body.newFilm.rating;
  const sql = "INSERT INTO film (title, description, length, rating, language_id) VALUES (?, ?, ?, ?, 1)";
  db.query(sql, [title, description, length, rating], (err, results) => {
    if (err) {
      throw err;
    }
    res.json({ message: "Record added", data: results });
  });
});

router.post("/delete", (req, res) => {
  const film_id = req.body.filmId;
  const sql = "DELETE FROM film WHERE film_id = ?";
  db.query(sql, [film_id], (err, results) => {
    if (err) {
      throw err;
    }
    res.json({ message: "Record deleted", data: results });
  });
});

router.post("/edit", (req, res) => {
  const film_id = req.body.editFilm.id;
  const title = req.body.editFilm.title;
  const description = req.body.editFilm.description;
  const length = req.body.editFilm.length;
  const sql = `UPDATE film SET title = ?, description = ?, length = ? WHERE film_id = ?`;
  const values = [title, description, length, film_id];
  db.query(sql, values, (err, results) => {
    if (err) {
      throw err;
    }
    res.json({ message: "Record updated", data: results });
  });
});

module.exports = router;

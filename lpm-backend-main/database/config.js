const sqlite3 = require("sqlite3").verbose();

// Configuración de la base de datos SQLite

const db = new sqlite3.Database("./database/data.db");

// Crear tablas y definir relaciones
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    title VARCHAR(35) NOT NULL UNIQUE,
    cover VARCHAR(1000) NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    categoryId INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(400) NOT NULL,
    price INTEGER NOT NULL,
    images TEXT NOT NULL,
    isActive BOOLEAN NOT NULL,
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON UPDATE RESTRICT ON DELETE RESTRICT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_name VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL
  )`);

  db.get("PRAGMA foreign_keys = ON");
});

module.exports = db;

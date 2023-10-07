const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

// Configuración de la base de datos SQLite
const db = new sqlite3.Database("./data.db");

// Crear tablas y definir relaciones
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    isActive BOOLEAN NOT NULL,
    cover TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    categoryId INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    isActive BOOLEAN NOT NULL,
    description VARCHAR(120) NOT NULL,
    images TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    price INTEGER NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(id)
  )`);
});

// Configurar el middleware body-parser para analizar datos JSON
app.use(bodyParser.json());

// Configuración de rutas CRUD para categories

// Obtener todas las categorías
app.get("/api/categories", (req, res) => {
  db.all("SELECT * FROM categories", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al obtener las categorías");
    } else {
      res.json(rows);
    }
  });
});

// Crear una nueva categoría
app.post("/api/categories", (req, res) => {
  const { title, isActive, cover } = req.body;

  db.run(
    "INSERT INTO categories (title, isActive, cover) VALUES (?, ?, ?)",
    [title, isActive, cover],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Error al crear la categoría");
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// Obtener una categoría por su ID
app.get("/api/categories/:id", (req, res) => {
  const categoryId = req.params.id;

  db.get("SELECT * FROM categories WHERE id = ?", [categoryId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al obtener la categoría");
    } else if (!row) {
      res.status(404).send("Categoría no encontrada");
    } else {
      res.json(row);
    }
  });
});

// Actualizar una categoría
app.put("/api/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const { title, isActive, cover } = req.body;

  db.run(
    "UPDATE categories SET title = ?, isActive = ?, cover = ? WHERE id = ?",
    [title, isActive, cover, categoryId],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al actualizar la categoría");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// Eliminar una categoría
app.delete("/api/categories/:id", (req, res) => {
  const categoryId = req.params.id;

  db.run("DELETE FROM categories WHERE id = ?", [categoryId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al eliminar la categoría");
    } else {
      res.sendStatus(200);
    }
  });
});

// Configuración de rutas CRUD para products

// Obtener todos los productos
// Ruta para obtener todos los productos con información de la categoría relacionada
app.get("/api/products", (req, res) => {
  db.all(
    "SELECT products.*, categories.title AS categoryTitle, categories.isActive AS categoryIsActive, categories.cover AS categoryCover FROM products INNER JOIN categories ON products.categoryId = categories.id",
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al obtener los productos");
      } else {
        const productsWithCategory = rows.map((row) => {
          const {
            categoryTitle,
            categoryIsActive,
            categoryCover,
            ...productData
          } = row;
          const category = {
            id: row.categoryId,
            title: categoryTitle,
            isActive: categoryIsActive,
            cover: categoryCover,
          };
          return {
            ...productData,
            category,
            images: JSON.parse(productData.images),
          };
        });
        res.json(productsWithCategory);
      }
    }
  );
});

// Crear un nuevo producto
app.post("/api/products", (req, res) => {
  const { categoryId, name, isActive, description, images, price } = req.body;

  db.run(
    "INSERT INTO products (categoryId, name, isActive, description, images, price) VALUES (?, ?, ?, ?, ?, ?)",
    [categoryId, name, isActive, description, JSON.stringify(images), price],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Error al crear el producto");
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// Obtener un producto por su ID
app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;

  db.get("SELECT * FROM products WHERE id = ?", [productId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al obtener el producto");
    } else if (!row) {
      res.status(404).send("Producto no encontrado");
    } else {
      res.json(row);
    }
  });
});

// Actualizar un producto
app.put("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const { categoryId, name, isActive, description, images, price } = req.body;

  db.run(
    "UPDATE products SET categoryId = ?, name = ?, isActive = ?, description = ?, images = ?, price = ? WHERE id = ?",
    [categoryId, name, isActive, description, images, price, productId],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al actualizar el producto");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// Eliminar un producto
app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;

  db.run("DELETE FROM products WHERE id = ?", [productId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al eliminar el producto");
    } else {
      res.sendStatus(200);
    }
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});

module.exports = app; 
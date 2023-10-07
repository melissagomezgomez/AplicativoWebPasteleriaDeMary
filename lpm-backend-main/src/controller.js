const db = require("../database/config");
const {
  DAYS_FOR_NOW,
  CATEGORIES_IDS_FOR_DAY,
  CATEGORIES_IDS_FOR_NOW,
} = require("./constants");
const moment = require("moment-timezone");
const { generateCurrentDate } = require("./utilities/general_functions");

module.exports = {
  getCategories: async (req, res) => {
    try {
      db.all(
        `SELECT categories.* FROM categories 
         INNER JOIN products 
          ON categories.id = products.categoryId 
         GROUP BY categories.id;`,
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener las categorías");
          } else if (!rows) {
            return res.status(404).send("La categoría no fue encontrada");
          } else {
            return res.json(rows);
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: e });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { title, cover } = req.body;

      //Insertar categoría
      const insertCategory = () =>
        db.run(
          "INSERT INTO categories (title, cover) VALUES (?, ?)",
          [title, cover],
          function (err) {
            if (err) {
              console.error(err);
              return res.status(500).send("Error al crear la categoría");
            } else {
              return res.json({ id: this.lastID });
            }
          }
        );

      //Validar que el titulo de la categoría sea única
      db.all(
        "SELECT * FROM categories WHERE title = ?",
        [title],
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al crear los productos");
          } else {
            if (rows.length > 0) {
              return res
                .status(484)
                .send("Ya hay una categoría registrada con ese mismo titulo");
            } else {
              insertCategory();
            }
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: e });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const categoryId = req.params.id;

      db.get(
        "SELECT * FROM categories WHERE id = ?",
        [categoryId],
        (err, row) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener la categoría");
          } else if (!row) {
            return res.status(404).send("Categoría no encontrada");
          } else {
            return res.json(row);
          }
        }
      );
    } catch (err) {
      res.status(500).json({ message: e });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const { title, cover } = req.body;

      db.run(
        "UPDATE categories SET title = ?, cover = ? WHERE id = ?",
        [title, cover, categoryId],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al actualizar la categoría");
          } else {
            return res.sendStatus(200);
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: e });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;

      db.run("DELETE FROM categories WHERE id = ?", [categoryId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error al eliminar la categoría");
        } else {
          return res.sendStatus(200);
        }
      });
    } catch (err) {
      return res.status(500).json({ message: e });
    }
  },

  getProducts: async (req, res) => {
    //Ver el frontend donde usa ese is active
    //SELECT products.*, categories.title AS categoryTitle, categories.isActive AS categoryIsActive, categories.cover AS categoryCover FROM products INNER JOIN categories ON products.categoryId = categories.id
    try {
      db.all(
        `SELECT 
          products.*, 
          categories.title AS categoryTitle, 
          categories.cover AS categoryCover 
         FROM products 
         INNER JOIN categories 
           ON products.categoryId = categories.id
         ORDER BY 
           products.isActive DESC,
           LENGTH(products.description) ASC;`,
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener los productos");
          } else {
            const productsWithCategory = rows.map((row) => {
              const { categoryTitle, categoryCover, ...productData } = row;
              const category = {
                id: row.categoryId,
                title: categoryTitle,
                cover: categoryCover,
              };
              return {
                ...productData,
                isNew:
                  moment
                    .duration(
                      moment(generateCurrentDate()).diff(productData.createdAt)
                    )
                    .asDays() <= DAYS_FOR_NOW,
                category,
                images: JSON.parse(productData.images),
              };
            });
            return res.json(productsWithCategory);
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: e });
    }
  },

  createProducts: async (req, res) => {
    try {
      const { categoryId, name, isActive, description, images, price } =
        req.body;

      //Registrar producto
      const insertProduct = () =>
        db.run(
          "INSERT INTO products (categoryId, name, isActive, description, images, price, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            categoryId,
            name,
            isActive,
            description,
            JSON.stringify(images),
            price,
            generateCurrentDate(),
          ],
          function (err) {
            if (err) {
              console.error(err);
              return res.status(500).send("Error al crear el producto");
            } else {
              return res.json({ id: this.lastID });
            }
          }
        );

      //Validar que el nombre del producto sea único
      const validateName = () =>
        db.all("SELECT * FROM products WHERE name = ?", [name], (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al crear los productos");
          } else {
            if (rows.length) {
              return res
                .status(484)
                .send("Ya hay un producto registrado con ese mismo nombre");
            } else {
              insertProduct();
            }
          }
        });

      //Validar la existencia de la categoría
      db.all(
        "SELECT * FROM categories WHERE id = ?",
        [categoryId],
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al crear los productos");
          } else {
            if (!rows.length) {
              return res
                .status(432)
                .send("No existe la categoría que desea asociar al producto");
            } else {
              validateName();
            }
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: e });
    }
  },

  // getProductById: (req, res) => {
  //   try {
  //     const productId = req.params.id;

  //     db.get("SELECT * FROM products WHERE id = ?", [productId], (err, row) => {
  //       if (err) {
  //         console.error(err);
  //         return res.status(500).send("Error al obtener el producto");
  //       } else if (!row) {
  //         return res.status(404).send("Producto no encontrado");
  //       } else {
  //         return res.json(row);
  //       }
  //     });
  //   } catch (err) {
  //     return res.status(500).json({ message: e });
  //   }
  // },

  getAvailableProducts: (req, res) => {
    try {
      db.all(
        `SELECT * FROM products 
         WHERE 
          categoryId IN ${CATEGORIES_IDS_FOR_DAY} 
          AND isActive = 1 
         ORDER BY RANDOM() LIMIT 3;`,
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener el producto");
          } else if (!rows) {
            return res.status(404).send("No hay productos del día");
          } else {
            const products = rows.map((row) => {
              return {
                ...row,
                images: JSON.parse(row.images),
              };
            });
            return res.json(products);
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: e });
    }
  },

  getNewProducts: (req, res) => {
    try {
      db.all(
        `SELECT * FROM products 
         WHERE 
          categoryId IN ${CATEGORIES_IDS_FOR_NOW} 
          AND isActive = 1 
          AND createdAt >= DATETIME('${generateCurrentDate()}', '-${DAYS_FOR_NOW} days')
         ORDER BY RANDOM() LIMIT 3;`,
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener el producto");
          } else if (!rows) {
            return res.status(404).send("No hay productos nuevos");
          } else {
            const products = rows.map((row) => {
              return {
                ...row,
                images: JSON.parse(row.images),
              };
            });
            return res.json(products);
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: e });
    }
  },

  updateProduct: (req, res) => {
    try {
      const productId = req.params.id;
      const { categoryId, name, isActive, description, images, price } =
        req.body;

      db.run(
        "UPDATE products SET categoryId = ?, name = ?, isActive = ?, description = ?, images = ?, price = ? WHERE id = ?",
        [categoryId, name, isActive, description, images, price, productId],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error al actualizar el producto");
          } else {
            return res.sendStatus(200);
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: e });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;

      db.run("DELETE FROM products WHERE id = ?", [productId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error al eliminar el producto");
        } else {
          return res.sendStatus(200);
        }
      });
    } catch (err) {
      return res.status(500).json({ message: e });
    }
  },
};

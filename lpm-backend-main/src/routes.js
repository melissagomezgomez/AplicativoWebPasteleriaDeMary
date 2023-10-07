const { Router } = require("express");
const router = Router();
const {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getProducts,
  createProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAvailableProducts,
  getNewProducts,
} = require("./controller");

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.get("/categories/:id", getCategoryById);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.get("/products", getProducts);
router.post("/products", createProducts);
// router.get("/products/:id", getProductById);
router.get("/products/products_available", getAvailableProducts);
router.get("/products/new_products", getNewProducts)
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;

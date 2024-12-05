const express = require("express");
const { getProducts, createProduct, getProduct, updateProduct, deleteProduct } = require("../controllers/products");
const multerMiddleware = require("../middlewares/multerMiddleware");

const router = express.Router();

router.route("/").get(getProducts).post(multerMiddleware.single('file'),createProduct);
router.route('/:productId').get(getProduct).put(multerMiddleware.single('file'),updateProduct);
router.route('/:productId').delete(deleteProduct);

module.exports = router;
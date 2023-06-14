const Product = require("../models/product");

// * Create New Product => /api/v1/product/new
exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

// * Get All Products => /api/v1/products
exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};

// * Get Single Product Details => /api/v1/product/:id
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      sucess: false,
      message: "Product Not Found!",
    });
  }
  res.status(200).json({
    sucess: true,
    product,
  });
};

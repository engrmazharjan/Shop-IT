const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

// * Create New Product => /api/v1/admin/product/new
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
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product Not Found!", 404));
    }
    res.status(200).json({
      sucess: true,
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

// * Update Product => /api/v1/admin/product/:id
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      sucess: false,
      message: "Product Not Found!",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    sucess: true,
    product,
  });
};

// * Delete Product => /api/v1/admin/product/:id
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      sucess: false,
      message: "Product Not Found!",
    });
  }

  await product.deleteOne();

  res.status(200).json({
    sucess: true,
    message: "Product Is Deleted",
  });
};

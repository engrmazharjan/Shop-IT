const Product = require("../models/product");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");
const products = require("../data/products");

// * Setting dotenv File
dotenv.config({ path: "backend/config/config.env" });

connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products Are Deleted");

    await Product.insertMany(products);
    console.log("All Products Are Added");

    process.exit();
  } catch (error) {
    console.log(error.stack);
    process.exit();
  }
};

seedProducts();

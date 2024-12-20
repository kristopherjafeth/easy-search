// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  external_id: { type: String, required: true },
  name: String,
  price: Number,
  sku: String,
  status: String,
  created_at: Date,
  updated_at: Date,
  categories: [String],
  images: [String],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  reviewCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  memoryOptions: [{ 
    size: String,
    price: Number
  }]
});

const Product = mongoose.model('Product', productSchema);

export default Product;
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  stockCount: {
    type: Number,
    required: true,
    default: 0,
  },
  mrp: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  brandName: {
    type: String,
    required: false,
  },
  images: [{
    type: String,
  }],
  returnEligibility: {
    type: Boolean,
    default: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'products',
});

// Add index for search
productSchema.index({ name: 'text', brandName: 'text', type: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;

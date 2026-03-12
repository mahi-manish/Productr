import express from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../models/product.model.js';
import { protect } from '../middleware/auth.middleware.js';
import logger from '../logger.js';
import { generateId } from '../utils/utility.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
import { upload } from '../utils/cloudinary.js';

// @desc Create a product
// @route POST /api/products
router.post('/', protect, upload.array('images', 7), async (req, res) => {
  const { name, type, stockCount, mrp, sellingPrice, brandName, returnEligibility } = req.body;
  
  const images = req.files ? req.files.map(file => file.path) : [];

  try {
    const product = await Product.create({
      productId: generateId(),
      userId: req.user.userId,
      name,
      type,
      stockCount,
      mrp,
      sellingPrice,
      brandName,
      images,
      returnEligibility,
      published: false,
    });

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    logger.error(`Create product error: ${error.message}`);
    res.status(500).json({ message: 'Something went wrong, please retry.' });
  }
});

// @desc Get all products of current user
// @route GET /api/products
router.get('/', protect, async (req, res) => {
  const { search } = req.query;

  try {
    let query = { userId: req.user.userId };
    logger.info(`Get products query: ${JSON.stringify(query)}`);

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brandName: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .select('productId name type stockCount mrp sellingPrice brandName images returnEligibility published -_id')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    logger.error(`Get products error: ${error.message}`);
    res.status(500).json({ message: 'Something went wrong, please retry.' });
  }
});

// @desc Get single product
// @route GET /api/products/:id
// router.get('/:id', protect, async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (product && product.userId.toString() === req.user.userId.toString()) {
//       res.json(product);
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }
//   } catch (error) {
//     logger.error(`Get product error: ${error.message}`);
//     res.status(500).json({ message: 'Something went wrong, please retry.' });
//   }
// });

// @desc Update product
// @route PUT /api/products/:id
router.put('/:id', protect, upload.array('images', 7), async (req, res) => {
  try {
    const { existingImages, ...restBody } = req.body;
    
    let parsedExistingImages = [];
    if (existingImages) {
      if (Array.isArray(existingImages)) {
        parsedExistingImages = existingImages;
      } else if (typeof existingImages === 'string') {
        parsedExistingImages = [existingImages];
      }
    }

    const newUploadedImages = req.files ? req.files.map(file => file.path) : [];
    const allImages = [...parsedExistingImages, ...newUploadedImages].slice(0, 7);

    const product = await Product.findOne({ productId: req.params.id });

    if (product && product.userId.toString() === req.user.userId.toString()) {
      Object.assign(product, restBody);
      product.images = allImages;
      await product.save();
      res.status(200).json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    logger.error(`Update product error: ${error.message}`);
    res.status(500).json({ message: 'Something went wrong, please retry.' });
  }
});

// @desc Delete product
// @route DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });

    if (product && product.userId.toString() === req.user.userId.toString()) {
      await product.deleteOne();
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    logger.error(`Delete product error: ${error.message}`);
    res.status(500).json({ message: 'Something went wrong, please retry.' });
  }
});

// @desc Toggle publish status
// @route PATCH /api/products/:id/publish
router.patch('/:id/publish', protect, async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });

    if (product && product.userId.toString() === req.user.userId.toString()) {
      product.published = !product.published;
      await product.save();
      res.status(200).json({ message: 'Product published successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    logger.error(`Toggle publish error: ${error.message}`);
    res.status(500).json({ message: 'Something went wrong, please retry.' });
  }
});

export default router;

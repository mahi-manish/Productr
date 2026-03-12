import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';
import connectDB from './db.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
logger.info(`Connecting to MongoDB with URI: ${process.env.MONGO_URI ? 'URI FOUND' : 'URI MISSING'}`);
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// Serve frontend in production (optional, but good practice)
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('dist'));
// }

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;

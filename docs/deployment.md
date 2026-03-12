# Deployment Guide

This guide explains how to host your project on GitHub and deploy it to a live server.

## 1. Hosting on GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Follow the instructions to push your local code:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

## 2. Choosing a Deployment Platform
For a MERN stack (MongoDB, Express, React, Node) application, we recommend:
- **Render** (Easy to use, Free tier available)
- **Railway** (Great developer experience)
- **Vercel** (Best for frontend, but requires backend to be hosted elsewhere or use serverless functions)

### Deployment on Render (Suggested)
1. Sign up on [Render.com](https://render.com/).
2. Create a **Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (This starts `server/index.js`)
5. Add **Environment Variables**:
   - `MONGO_URI`: Your MongoDB connection string.
   - `PORT`: 10000 (Render's default) or leave it (Express handles it).

## 3. Serving Frontend from Backend (Monolithic)
In production, your backend can serve the static frontend files.
In `server/index.js`, ensure you have:
```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}
```
*Note: The current project is configured to use Vite's proxy for development.*

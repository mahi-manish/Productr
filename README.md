# Product Management App - Assignment

Hi, this is my submission for the product management tool assignment. I've built this application to be secure, fast, and easy to use. It handles everything from user registration (with real email OTP) to managing product listings with multi-image support.

## What this app does:
- **Secure Authentication**: Users sign up or log in using an OTP sent to their email. This makes it more secure than traditional passwords.
- **Product CRUD**: You can easily add, view, edit, or delete products. Each product can have up to 7 images.
- **Cloud Storage**: Since I've optimized this for Vercel, I used **Cloudinary** for image hosting. This ensures that uploaded images don't disappear when the server restarts.
- **Modern UI**: The interface is clean and responsive, built using React and Tailwind CSS.

## The Tech Stack I used:
- **Frontend**: React (Vite) for a fast development experience.
- **Backend**: Node.js and Express.js.
- **Database**: MongoDB with Mongoose for data modeling.
- **Services**: **Nodemailer** for sending OTPs and **Cloudinary** for handling image uploads.

## How to run it locally:

1. **Clone the project**:
   ```bash
   git clone https://github.com/mahi-manish/Productr.git
   cd Productr
   ```

2. **Install things**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   Create a `.env` file in the root folder and add your keys:
   ```env
   MONGO_URI=your_mongodb_url
   JWT_SECRET=any_secret_key
   
   # For OTP (Use a Gmail App Password)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # For Cluster Images
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Launch it**:
   ```bash
   npm run dev
   ```

## A few notes on the implementation:
- I used **Serverless-friendly** logic so it can be deployed on Vercel without issues.
- I've included a `vercel.json` file to make the deployment process straightforward.
- For images, I chose Cloudinary because it's the industry standard for handling media in cloud-hosted apps.

Thanks for checking out my work!

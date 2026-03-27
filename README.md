# Hostel Mess Management System

## Overview
This is a Node.js/Express web application designed for managing a hostel mess system, including student dashboards, admin controls, attendance scanning, meals, and billing.

## Environment Variables
Create a `.env` file in the root directory and configure the following variables (see `.env.example` for reference):
- `MONGODB_URI`: Your MongoDB connection string (e.g., MongoDB Atlas URI).
- `PORT`: The port on which the server will run (default is `8080`).
- `SESSION_SECRET`: A secure random string used to sign session cookies.

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Make sure you have configured the `.env` file correctly with your MongoDB credentials.

## Development

To run the application in development mode with auto-reloading:
```bash
npm run dev
```

## Production

To run the application in production mode:
```bash
npm start
```

## Deployment Notes
- Ensure all environment variables are correctly set in your deployment environment (e.g., Vercel, Render, Railway).
- Do not commit `.env` or any sensitive credentials to the repository. Ensure `.gitignore` is active.
- The app uses `helmet` for security headers and `cors` for Cross-Origin Resource Sharing.

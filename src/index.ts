import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import centralRoutes from './http/routes/centralRoutes';
import branchRoutes from './http/routes/branchRoutes';
import adminRoutes from './http/routes/adminRoutes';
import { errorMiddleware } from './http/middleware/errorMiddleware';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Register body parser middleware
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Register routes
app.use('/central', centralRoutes);
app.use('/branch', branchRoutes);
app.use('/admin', adminRoutes);

// Register error middleware as last middleware
app.use(errorMiddleware);

// Export app for Vercel serverless
export default app;

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic /health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is healthy!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access health check at http://localhost:${PORT}/health`);
}); 
import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import { initProject } from './models/project'; // Import the init function
import { Project } from './models/project';

import projectRoutes from './routes/projectRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is healthy!' });
});

app.use('/api/projects', projectRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Initialize models AFTER successful database connection
    initProject(sequelize);
    console.log('Models initialized successfully.');
    
    // Sync database models
    await sequelize.sync();
    console.log('Database models synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access health check at http://localhost:${PORT}/health`);
      console.log(`Project API available at http://localhost:${PORT}/api/projects`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
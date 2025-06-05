import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import { initProject } from './models/project'; // Import the init function
import { Project } from './models/project';

import projectRoutes from './routes/projectRoutes';
import ingestionRoutes from './routes/ingestionRoutes';
import analysisRoutes from './routes/analysisRoutes';
import embeddingRoutes from './routes/embeddingRoutes';
import { getOrCreateCollection } from './config/chromadb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is healthy!' });
});

app.use('/api/projects', projectRoutes);
app.use('/api/ingest-codebase', ingestionRoutes);
app.use('/api/analyze-code', analysisRoutes);
app.use('/api/embed-code', embeddingRoutes);

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

    // Initialize ChromaDB collection
    await getOrCreateCollection('code_documentation_chunks');
    console.log('ChromaDB collection initialized successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access health check at http://localhost:${PORT}/health`);
      console.log(`Project API available at http://localhost:${PORT}/api/projects`);
      console.log(`Codebase ingestion API available at http://localhost:${PORT}/api/ingest-codebase`);
      console.log(`Code analysis API available at http://localhost:${PORT}/api/analyze-code`);
      console.log(`Code embedding API available at http://localhost:${PORT}/api/embed-code`);
    });
  } catch (error) {
    console.error('Unable to connect to databases or start server:', error);
    process.exit(1);
  }
};

startServer();
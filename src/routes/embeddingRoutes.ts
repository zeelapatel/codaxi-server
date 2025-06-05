import { Router, Request, Response } from 'express';
import fs from 'fs';
import EmbeddingService from '../services/EmbeddingService';
import { Project } from '../models/project';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { filePath, projectId } = req.body;

  if (!filePath || !projectId) {
    return res.status(400).json({ error: 'filePath and projectId are required in the request body' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `File not found: ${filePath}` });
  }

  try {
    // Validate project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: `Project with ID ${projectId} not found` });
    }

    await EmbeddingService.embedAndStoreCode(filePath, projectId);
    res.json({ 
      message: 'Successfully processed and embedded code',
      filePath,
      projectId
    });
  } catch (error) {
    console.error('Error embedding code:', error);
    res.status(500).json({ 
      error: 'Failed to embed code',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router; 
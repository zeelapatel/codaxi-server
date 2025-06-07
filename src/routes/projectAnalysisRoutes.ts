import { Router, Request, Response } from 'express';
import { Project } from '../models/project';
import ProjectAnalysisService from '../services/ProjectAnalysisService';
import fs from 'fs/promises';

const router = Router();

router.post('/:projectId/analyze-full-project', async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { directoryPath } = req.body;

  if (!directoryPath) {
    return res.status(400).json({ message: 'directoryPath is required in the request body.' });
  }

  try {
    // Check if directory exists
    try {
      await fs.access(directoryPath);
    } catch {
      return res.status(404).json({ message: `Directory not found: ${directoryPath}` });
    }

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: `Project with ID ${projectId} not found.` });
    }

    // Trigger the analysis in the background
    ProjectAnalysisService.analyzeProject(projectId, directoryPath)
      .then(() => console.log(`Full project analysis completed for ${projectId}`))
      .catch(err => console.error(`Full project analysis failed for ${projectId}:`, err));

    res.status(202).json({
      message: `Full project analysis started for project ${projectId}. This may take some time.`,
      projectId,
    });
  } catch (error: any) {
    console.error('Error initiating full project analysis:', error);
    res.status(500).json({ 
      message: 'Failed to initiate full project analysis',
      error: error.message 
    });
  }
});

export default router; 
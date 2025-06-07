import { Router, Request, Response } from 'express';
import { Project } from '../models/project';
import ProjectDocGenerationService from '../services/ProjectDocGenerationService';

const router = Router();

// POST /api/projects/:projectId/generate-api-docs - Triggers full API documentation generation
router.post('/:projectId/generate-api-docs', async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: `Project with ID ${projectId} not found.` });
    }
    if (!project.projectContext) {
      return res.status(400).json({ 
        message: `Project context not analyzed for ${projectId}. Please run full project analysis first.` 
      });
    }

    // Trigger documentation generation in the background
    ProjectDocGenerationService.generateProjectApiDocumentation(projectId)
      .then(() => console.log(`API documentation generation completed for ${projectId}`))
      .catch(err => console.error(`API documentation generation failed for ${projectId}:`, err));

    res.status(202).json({
      message: `API documentation generation started for project ${projectId}. This may take some time.`,
      projectId: projectId,
    });
  } catch (error: any) {
    console.error('Error initiating API documentation generation:', error);
    res.status(500).json({ 
      message: 'Failed to initiate documentation generation', 
      error: error.message 
    });
  }
});

// GET /api/projects/:projectId/api-docs - Retrieves generated API documentation
router.get('/:projectId/api-docs', async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: `Project with ID ${projectId} not found.` });
    }
    if (!project.generatedApiDocs) {
      return res.status(404).json({ 
        message: `No API documentation found for project ${projectId}. Please generate it first.` 
      });
    }

    res.status(200).json({
      projectId: projectId,
      apiDocumentation: project.generatedApiDocs,
    });
  } catch (error: any) {
    console.error('Error retrieving API documentation:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve API documentation', 
      error: error.message 
    });
  }
});

export default router; 
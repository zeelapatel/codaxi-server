import { Router, Request, Response } from 'express';
import { Project } from '../models/project';

const router = Router();

// POST /api/projects - Create a new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    const project = await Project.create({ name, description });
    res.status(201).json(project);
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Project with this name already exists' });
    }
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// GET /api/projects - Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// GET /api/projects/:id - Get a single project by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// PUT /api/projects/:id - Update an existing project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.update({ 
      name: name || project.name,
      description: description || project.description
    });
    res.status(200).json(project);
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Project with this name already exists' });
    }
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.destroy();
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

export default router; 
import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import CodeAnalysisService from '../services/CodeAnalysisService';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'filePath is required in the request body' });
    }

    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `File not found: ${filePath}` });
    }

    // Ensure the file is a JavaScript or TypeScript file
    const ext = path.extname(filePath).toLowerCase();
    if (!['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
      return res.status(400).json({ error: 'Only JavaScript/TypeScript files are supported' });
    }

    const analysis = await CodeAnalysisService.analyzeFile(filePath);
    
    res.json({
      filePath,
      ...analysis
    });
  } catch (error) {
    console.error('Error analyzing file:', error);
    res.status(500).json({ 
      error: 'Failed to analyze file',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router; 
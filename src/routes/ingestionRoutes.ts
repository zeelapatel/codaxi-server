import { Router, Request, Response } from 'express';
import CodebaseIngestionService from '../services/CodebaseIngestionService';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { directoryPath } = req.body;

  if (!directoryPath) {
    return res.status(400).json({ 
      message: 'directoryPath is required in the request body' 
    });
  }

  try {
    const files = await CodebaseIngestionService.scanDirectory(directoryPath);
    
    // Get detailed information for each file
    const filesWithInfo = await Promise.all(
      files.map(async (filePath) => {
        return await CodebaseIngestionService.getFileInfo(filePath);
      })
    );

    res.status(200).json({
      message: `Successfully scanned directory: ${directoryPath}`,
      fileCount: files.length,
      files: filesWithInfo
    });
  } catch (error: any) {
    console.error('Error scanning directory:', error);
    res.status(500).json({ 
      message: 'Failed to scan directory', 
      error: error.message 
    });
  }
});

export default router; 
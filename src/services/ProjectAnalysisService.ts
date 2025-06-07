import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { Project } from '../models/project';

const execPromise = promisify(exec);

interface ProjectContext {
  fileList: string[];
  directoryTree: string;
  dependencyGraph: any;
  highLevelSummary?: string;
}

class ProjectAnalysisService {
  private async generateDirectoryTree(dirPath: string, indent: string = ''): Promise<string> {
    let tree = '';
    const files = await fs.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      if (file.name === 'node_modules' || file.name.startsWith('.')) {
        continue; // Skip node_modules and hidden files/dirs
      }
      const fullPath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        tree += `${indent}├── ${file.name}/\n`;
        tree += await this.generateDirectoryTree(fullPath, indent + '│   ');
      } else {
        tree += `${indent}└── ${file.name}\n`;
      }
    }
    return tree;
  }

  private async getAllFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    async function scan(currentPath: string) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
          continue;
        }
        
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          await scan(fullPath);
        } else {
          files.push(fullPath);
        }
      }
    }
    
    await scan(dirPath);
    return files;
  }

  public async analyzeProject(projectId: string, directoryPath: string): Promise<void> {
    console.log(`Starting full project analysis for Project ID: ${projectId} at ${directoryPath}`);
    try {
      // 1. Get file list
      const fileList = await this.getAllFiles(directoryPath);

      // 2. Generate directory tree
      const directoryTree = await this.generateDirectoryTree(directoryPath);

      // 3. Generate dependency graph using dependency-cruiser
      let dependencyGraph: any = {};
      try {
        const { stdout } = await execPromise(
          `npx depcruise --config .dependency-cruiser.js --output-type json "${directoryPath}"`,
          { cwd: directoryPath }
        );
        dependencyGraph = JSON.parse(stdout);
        console.log('Dependency graph generated successfully.');
      } catch (depCruiseError: any) {
        console.warn(`Could not generate full dependency graph: ${depCruiseError.message}`);
        // Continue without dependency graph if it fails
      }

      const projectContext: ProjectContext = {
        fileList,
        directoryTree,
        dependencyGraph,
        highLevelSummary: `Project contains ${fileList.length} files. Directory structure:\n${directoryTree}`,
      };

      // Update the Project record in the database
      const project = await Project.findByPk(projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found.`);
      }

      project.projectContext = projectContext;
      await project.save();
      console.log(`Project context saved for Project ID: ${projectId}`);
    } catch (error: any) {
      console.error(`Error during full project analysis for ${projectId}:`, error);
      throw error;
    }
  }
}

export default new ProjectAnalysisService(); 
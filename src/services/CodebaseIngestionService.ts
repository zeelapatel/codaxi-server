import fs from 'fs';
import path from 'path';

class CodebaseIngestionService {
  private allowedExtensions = ['.js', '.ts', '.jsx', '.tsx'];

  /**
   * Recursively scans a directory for allowed code files.
   * @param directoryPath The root directory to scan.
   * @returns A promise that resolves to an array of absolute file paths.
   */
  public async scanDirectory(directoryPath: string): Promise<string[]> {
    try {
      if (!fs.existsSync(directoryPath)) {
        throw new Error(`Directory not found: ${directoryPath}`);
      }

      const stats = await fs.promises.stat(directoryPath);
      if (!stats.isDirectory()) {
        throw new Error(`Path is not a directory: ${directoryPath}`);
      }

      const fileList: string[] = [];
      const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });

      for (const file of files) {
        const fullPath = path.join(directoryPath, file.name);

        if (file.isDirectory()) {
          // Skip node_modules and hidden directories
          if (file.name === 'node_modules' || file.name.startsWith('.')) {
            continue;
          }
          const subDirFiles = await this.scanDirectory(fullPath);
          fileList.push(...subDirFiles);
        } else if (this.allowedExtensions.includes(path.extname(file.name))) {
          fileList.push(fullPath);
        }
      }

      return fileList;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to scan directory: ${error}`);
    }
  }

  /**
   * Gets basic information about a file.
   * @param filePath Path to the file
   * @returns Object containing file information
   */
  public async getFileInfo(filePath: string) {
    const stats = await fs.promises.stat(filePath);
    return {
      path: filePath,
      size: stats.size,
      lastModified: stats.mtime,
      extension: path.extname(filePath),
      filename: path.basename(filePath)
    };
  }
}

export default new CodebaseIngestionService(); 
import OpenAI from 'openai';
import { getOrCreateCollection } from '../config/chromadb';
import CodeAnalysisService from './CodeAnalysisService';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class EmbeddingService {
  private collectionName = 'code_documentation_chunks';

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  public async embed(text: string): Promise<number[]> {
    return this.generateEmbedding(text);
  }

  public async embedAndStoreCode(filePath: string, projectId: string): Promise<void> {
    const collection = await getOrCreateCollection(this.collectionName);
    const analysis = await CodeAnalysisService.analyzeFile(filePath);
    const documentsToEmbed: { id: string; content: string; metadata: any }[] = [];

    // Process functions
    for (const func of analysis.functions) {
      const content = `Function: ${func.name}(${func.parameters.join(', ')})`;
      documentsToEmbed.push({
        id: uuidv4(),
        content,
        metadata: {
          filePath,
          projectId,
          type: 'function',
          name: func.name,
          parameters: func.parameters,
          startLine: func.startLine,
          endLine: func.endLine,
        },
      });
    }

    // Process routes
    for (const route of analysis.routes) {
      const content = `Route: ${route.method.toUpperCase()} ${route.path}`;
      documentsToEmbed.push({
        id: uuidv4(),
        content,
        metadata: {
          filePath,
          projectId,
          type: 'route',
          method: route.method,
          path: route.path,
        },
      });
    }

    if (documentsToEmbed.length === 0) {
      console.log(`No functions or routes found in ${filePath} to embed.`);
      return;
    }

    const ids = documentsToEmbed.map(doc => doc.id);
    const contents = documentsToEmbed.map(doc => doc.content);
    const metadatas = documentsToEmbed.map(doc => doc.metadata);

    // Generate embeddings using OpenAI
    const embeddings = await Promise.all(contents.map(content => this.generateEmbedding(content)));

    await collection.add({
      ids,
      embeddings,
      documents: contents,
      metadatas,
    });

    console.log(`Successfully embedded and stored ${documentsToEmbed.length} chunks from ${filePath} in ChromaDB.`);
  }
}

export default new EmbeddingService(); 
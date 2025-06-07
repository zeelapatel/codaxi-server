import { getOrCreateCollection } from '../config/chromadb';
import CodeAnalysisService, { FunctionInfo, RouteInfo } from './CodeAnalysisService';
import EmbeddingService from './EmbeddingService';
import { Project } from '../models/project';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

interface ApiDocumentation {
  type: 'function' | 'route';
  filePath: string;
  name?: string;
  method?: string;
  path?: string;
  documentation: string;
}

class ProjectDocGenerationService {
  private openai: OpenAI;
  private llmModel: string = 'gpt-4';
  private collectionName = 'code_documentation_chunks';

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables.');
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generates documentation for a single code unit (function/route) with RAG.
   */
  private async generateDocForCodeUnit(
    codeSnippet: string,
    docType: 'function' | 'route',
    projectId: string,
    additionalContext: string = ''
  ): Promise<string> {
    const collection = await getOrCreateCollection(this.collectionName);

    // Generate embedding for the code snippet
    const queryEmbedding = await EmbeddingService.embed(codeSnippet);
    
    // Query ChromaDB for relevant context
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5,
      where: { projectId: projectId },
    });

    let retrievedContext = '';
    if (results.documents && results.documents.length > 0) {
      retrievedContext = results.documents[0]
        .filter((doc: string | null): doc is string => doc !== null)
        .map((doc: string, i: number) => `Context ${i + 1}:\n${doc}`)
        .join('\n\n');
    }

    const prompt = `You are an expert Node.js developer and technical writer. Generate concise and accurate API documentation for the following ${docType}. Focus on describing its purpose, parameters, and return value. If it's a route, describe the HTTP method, path, request body, query parameters, and possible responses.

    Use the provided context to ensure accuracy and avoid hallucination. Only provide the documentation content in OpenAPI/Swagger format.

    Additional Project Context:
    ${additionalContext}

    Retrieved Code Context:
    ${retrievedContext}

    Code to document:
    \`\`\`javascript
    ${codeSnippet}
    \`\`\``;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.llmModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1000,
      });

      const generatedDoc = response.choices[0].message.content;
      if (!generatedDoc) {
        throw new Error('LLM returned empty content.');
      }
      return generatedDoc.trim();
    } catch (error: any) {
      console.error('Error calling OpenAI API:', error.message);
      throw new Error(`Failed to generate documentation: ${error.message}`);
    }
  }

  /**
   * Orchestrates the generation of API documentation for an entire project.
   */
  public async generateProjectApiDocumentation(projectId: string): Promise<void> {
    console.log(`Starting API documentation generation for Project ID: ${projectId}`);
    try {
      const project = await Project.findByPk(projectId);
      if (!project || !project.projectContext) {
        throw new Error(`Project ${projectId} not found or project context not analyzed.`);
      }

      const { fileList, highLevelSummary } = project.projectContext;
      const allGeneratedDocs: ApiDocumentation[] = [];

      for (const filePath of fileList) {
        console.log(`Processing file: ${filePath}`);
        try {
          // Extract functions and routes
          const { functions, routes } = await CodeAnalysisService.analyzeFile(filePath);

          // Document functions
          for (const func of functions) {
            const functionCode = `function ${func.name}(${func.parameters.join(', ')}) {\n  // Function body from lines ${func.startLine} to ${func.endLine}\n}`;
            const doc = await this.generateDocForCodeUnit(
              functionCode,
              'function',
              projectId,
              highLevelSummary
            );
            allGeneratedDocs.push({
              type: 'function',
              filePath,
              name: func.name,
              documentation: doc,
            });
          }

          // Document routes
          for (const route of routes) {
            const routeCode = `router.${route.method.toLowerCase()}('${route.path}', (req, res) => { /* Route handler */ })`;
            const doc = await this.generateDocForCodeUnit(
              routeCode,
              'route',
              projectId,
              highLevelSummary
            );
            allGeneratedDocs.push({
              type: 'route',
              filePath,
              method: route.method,
              path: route.path,
              documentation: doc,
            });
          }
        } catch (fileError: any) {
          console.warn(`Error processing ${filePath}: ${fileError.message}`);
          continue;
        }
      }

      // Update the Project record with generated API docs
      project.generatedApiDocs = allGeneratedDocs;
      await project.save();
      console.log(`API documentation saved for Project ID: ${projectId}`);
    } catch (error: any) {
      console.error(`Error during API documentation generation for ${projectId}:`, error);
      throw error;
    }
  }
}

export default new ProjectDocGenerationService();
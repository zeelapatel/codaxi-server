import { parse, Lang } from '@ast-grep/napi';
import fs from 'fs';
import path from 'path';

export interface FunctionInfo {
  name: string;
  parameters: string[];
  startLine: number;
  endLine: number;
}

export interface RouteInfo {
  method: string;
  path: string;
}

class CodeAnalysisService {
  public async analyzeFunctions(filePath: string): Promise<FunctionInfo[]> {
    const sourceCode = await fs.promises.readFile(filePath, 'utf-8');
    const lang = filePath.endsWith('.ts') || filePath.endsWith('.tsx') ? Lang.TypeScript : Lang.JavaScript;
    const ast = parse(lang, sourceCode);
    const root = ast.root();
    const functions: FunctionInfo[] = [];

    // Find function declarations
    const functionNodes = root.findAll('function $NAME($PARAMS) { $$$BODY }');
    for (const node of functionNodes) {
      const nameNode = node.getMatch('NAME');
      const paramsNode = node.getMatch('PARAMS');

      if (nameNode && paramsNode) {
        functions.push({
          name: nameNode.text(),
          parameters: paramsNode.text().split(',').map(p => p.trim()).filter(p => p),
          startLine: node.range().start.line + 1,
          endLine: node.range().end.line + 1,
        });
      }
    }

    // Find arrow function expressions assigned to variables
    const arrowFunctionNodes = root.findAll('const $NAME = ($PARAMS) => { $$$BODY }');
    for (const node of arrowFunctionNodes) {
      const nameNode = node.getMatch('NAME');
      const paramsNode = node.getMatch('PARAMS');

      if (nameNode && paramsNode) {
        functions.push({
          name: nameNode.text(),
          parameters: paramsNode.text().split(',').map(p => p.trim()).filter(p => p),
          startLine: node.range().start.line + 1,
          endLine: node.range().end.line + 1,
        });
      }
    }

    return functions;
  }

  public async extractExpressRoutes(filePath: string): Promise<RouteInfo[]> {
    const sourceCode = await fs.promises.readFile(filePath, 'utf-8');
    const lang = filePath.endsWith('.ts') || filePath.endsWith('.tsx') ? Lang.TypeScript : Lang.JavaScript;
    const ast = parse(lang, sourceCode);
    const root = ast.root();
    const routes: RouteInfo[] = [];

    // Find Express route definitions
    const routeMethods = ['get', 'post', 'put', 'delete', 'patch'];
    for (const method of routeMethods) {
      const routeNodes = root.findAll(`$APP.${method}($PATH, $$$HANDLER)`);
      for (const node of routeNodes) {
        const pathNode = node.getMatch('PATH');
        if (pathNode) {
          // Remove quotes from the path string
          const path = pathNode.text().replace(/['"]/g, '');
          routes.push({
            method: method.toUpperCase(),
            path,
          });
        }
      }
    }

    return routes;
  }

  public async analyzeFile(filePath: string): Promise<{
    functions: FunctionInfo[];
    routes: RouteInfo[];
  }> {
    const [functions, routes] = await Promise.all([
      this.analyzeFunctions(filePath),
      this.extractExpressRoutes(filePath),
    ]);

    return {
      functions,
      routes,
    };
  }
}

export default new CodeAnalysisService(); 
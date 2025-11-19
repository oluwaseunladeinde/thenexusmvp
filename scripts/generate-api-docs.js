#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate API Documentation Summary
 * This script scans API routes and generates documentation
 */

const API_DIR = path.join(__dirname, '../src/app/api/v1');
const OUTPUT_FILE = path.join(__dirname, '../docs/api/endpoints.json');

function scanApiRoutes(dir, basePath = '') {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return [];
  }

  const routes = [];
  let items;
  try {
    items = fs.readdirSync(dir);
  } catch (error) {
    console.warn(`⚠️  Cannot read directory ${dir}: ${error.message}`);
    return [];
  }

  for (const item of items) {
    const fullPath = path.join(dir, item);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (error) {
      console.warn(`⚠️  Cannot stat ${fullPath}: ${error.message}`);
      continue;
    }

    if (stat.isDirectory()) {
      // Handle dynamic routes like [id]
      const routePath = item.startsWith('[') && item.endsWith(']')
        ? `${basePath}/{${item.slice(1, -1)}}`
        : `${basePath}/${item}`;

      routes.push(...scanApiRoutes(fullPath, routePath));
    } else if (item === 'route.ts') {
      // Found an API route file
      let content;
      try {
        content = fs.readFileSync(fullPath, 'utf8');
      } catch (error) {
        console.warn(`⚠️  Cannot read ${fullPath}: ${error.message}`);
        continue;
      }
      const methods = extractHttpMethods(content);
      const swaggerDocs = extractSwaggerDocs(content);

      routes.push({
        path: basePath || '/',
        methods,
        file: fullPath.replace(path.join(__dirname, '../'), ''),
        swagger: swaggerDocs
      });
    }
  }

  return routes;
}

function extractHttpMethods(content) {
  const methods = [];
  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  for (const method of httpMethods) {
    // Match: export async function METHOD, export function METHOD, export const METHOD =
    const regex = new RegExp(`export\\s+(?:async\\s+)?(?:function\\s+${method}|const\\s+${method}\\s*=)`, 'g');
    if (regex.test(content)) {
      methods.push(method);
    }
  }

  return methods;
}

function extractSwaggerDocs(content) {
  const swaggerBlocks = [];
  const swaggerRegex = /\/\*\*\s*\n\s*\*\s*@swagger\s*\n([\s\S]*?)\*\//g;
  let match;

  while ((match = swaggerRegex.exec(content)) !== null) {
    swaggerBlocks.push(match[1].replace(/^\s*\*\s?/gm, '').trim());
  }

  return swaggerBlocks;
}

function generateDocumentation() {
  console.log('🔍 Scanning API routes...');

  const routes = scanApiRoutes(API_DIR);

  console.log(`📋 Found ${routes.length} API routes:`);

  routes.forEach(route => {
    console.log(`  ${route.methods.join(', ')} ${route.path}`);
  });

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write routes summary
  const summary = {
    generatedAt: new Date().toISOString(),
    totalRoutes: routes.length,
    baseUrl: '/api/v1',
    routes: routes.map(route => ({
      path: `/api/v1${route.path}`,
      methods: route.methods,
      hasSwagger: route.swagger.length > 0,
      swagger: route.swagger
    }))
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2));

  console.log(`✅ Documentation generated: ${OUTPUT_FILE}`);
  console.log(`📊 Summary:`);
  console.log(`   - Total routes: ${routes.length}`);
  console.log(`   - With Swagger docs: ${routes.filter(r => r.swagger.length > 0).length}`);
  console.log(`   - Missing docs: ${routes.filter(r => r.swagger.length === 0).length}`);

  return summary;
}

// Run the generation
try {
  generateDocumentation();
} catch (error) {
  console.error('❌ Error generating documentation:', error.message);
  process.exit(1);
}

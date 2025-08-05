import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import { VectorStore } from './vectorStore';

export class DocumentProcessor {
  private vectorStore: VectorStore;

  constructor(vectorStore: VectorStore) {
    this.vectorStore = vectorStore;
  }

  async processMarkdownFiles(directoryPath: string): Promise<void> {
    try {
      const files = fs.readdirSync(directoryPath);
      const markdownFiles = files.filter(file => file.endsWith('.md'));

      for (const file of markdownFiles) {
        await this.processMarkdownFile(path.join(directoryPath, file));
      }

      console.log(`Processed ${markdownFiles.length} markdown files`);
    } catch (error) {
      console.error('Error processing markdown files:', error);
      throw error;
    }
  }

  private async processMarkdownFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const html = marked(content);
      
      // Extract text content from HTML
      const textContent = this.extractTextFromHTML(html);
      
      // Split content into chunks
      const chunks = this.splitIntoChunks(textContent, 1000); // 1000 characters per chunk
      
      // Add chunks to vector store
      for (const chunk of chunks) {
        if (chunk.trim().length > 50) { // Only add chunks with meaningful content
          await this.vectorStore.addChunk(
            chunk.trim(),
            path.basename(filePath),
            { source: filePath }
          );
        }
      }

      console.log(`Processed ${chunks.length} chunks from ${path.basename(filePath)}`);
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }

  private extractTextFromHTML(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

  private splitIntoChunks(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const sentenceWithPeriod = sentence.trim() + '.';
      
      if (currentChunk.length + sentenceWithPeriod.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentenceWithPeriod;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentenceWithPeriod;
      }
    }
    
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }
} 
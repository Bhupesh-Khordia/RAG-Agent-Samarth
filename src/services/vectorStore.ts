import { Chunk, SearchResult } from '../types';
import { EmbeddingService } from './embeddingService';

export class VectorStore {
  private chunks: Chunk[] = [];
  private embeddingService: EmbeddingService;

  constructor(embeddingService: EmbeddingService) {
    this.embeddingService = embeddingService;
  }

  async addChunk(content: string, source: string, metadata?: Record<string, any>): Promise<void> {
    const embedding = await this.embeddingService.getEmbedding(content);
    const chunk: Chunk = {
      id: `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      source,
      embedding,
      metadata
    };
    this.chunks.push(chunk);
  }

  async search(query: string, topK: number = 3): Promise<SearchResult[]> {
    const queryEmbedding = await this.embeddingService.getEmbedding(query);
    
    const results: SearchResult[] = this.chunks.map(chunk => ({
      chunk,
      similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    // Sort by similarity (descending) and return top K results
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  getChunkCount(): number {
    return this.chunks.length;
  }

  getAllChunks(): Chunk[] {
    return [...this.chunks];
  }
} 
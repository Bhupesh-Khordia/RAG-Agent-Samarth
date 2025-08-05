import axios from 'axios';

export class EmbeddingService {
  private apiUrl = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';
  private apiKey?: string;

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
  }

  async getEmbedding(text: string): Promise<number[]> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await axios.post(
        this.apiUrl,
        { inputs: text },
        { headers }
      );

      if (response.data && Array.isArray(response.data)) {
        return response.data[0];
      } else if (response.data && Array.isArray(response.data.embeddings)) {
        return response.data.embeddings[0];
      } else {
        throw new Error('Unexpected response format from Hugging Face API');
      }
    } catch (error) {
      console.error('Error getting embedding:', error);
      // Fallback to a simple hash-based embedding if API fails
      return this.getFallbackEmbedding(text);
    }
  }

  async getEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await axios.post(
        this.apiUrl,
        { inputs: texts },
        { headers }
      );

      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.embeddings)) {
        return response.data.embeddings;
      } else {
        throw new Error('Unexpected response format from Hugging Face API');
      }
    } catch (error) {
      console.error('Error getting embeddings:', error);
      // Fallback to simple hash-based embeddings
      return texts.map(text => this.getFallbackEmbedding(text));
    }
  }

  private getFallbackEmbedding(text: string): number[] {
    // Simple hash-based embedding as fallback
    const hash = this.simpleHash(text);
    const embedding = new Array(384).fill(0);
    
    // Distribute the hash across the embedding dimensions
    for (let i = 0; i < Math.min(embedding.length, 32); i++) {
      embedding[i] = (hash >> (i * 8)) & 0xFF;
    }
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      return embedding.map(val => val / magnitude);
    }
    
    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
} 
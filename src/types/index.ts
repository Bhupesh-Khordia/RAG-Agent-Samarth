export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Chunk {
  id: string;
  content: string;
  source: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

export interface PluginResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface Plugin {
  name: string;
  description: string;
  execute: (query: string) => Promise<PluginResult>;
}

export interface AgentRequest {
  message: string;
  session_id: string;
}

export interface AgentResponse {
  reply: string;
  session_id: string;
  context_used?: string[];
  plugins_used?: string[];
  timestamp: Date;
}

export interface EmbeddingResponse {
  embedding: number[];
}

export interface SearchResult {
  chunk: Chunk;
  similarity: number;
} 
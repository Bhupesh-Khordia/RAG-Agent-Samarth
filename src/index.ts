import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { AgentRequest, AgentResponse } from './types';
import { EmbeddingService } from './services/embeddingService';
import { VectorStore } from './services/vectorStore';
import { LLMService } from './services/llmService';
import { SessionManager } from './services/sessionManager';
import { PluginManager } from './services/pluginManager';
import { DocumentProcessor } from './services/documentProcessor';
import { AgentService } from './services/agentService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const embeddingService = new EmbeddingService();
const vectorStore = new VectorStore(embeddingService);
const llmService = new LLMService();
const sessionManager = new SessionManager();
const pluginManager = new PluginManager();
const documentProcessor = new DocumentProcessor(vectorStore);
const agentService = new AgentService(llmService, vectorStore, sessionManager, pluginManager);

// Initialize knowledge base
async function initializeKnowledgeBase() {
  try {
    console.log('Initializing knowledge base...');
    await documentProcessor.processMarkdownFiles('./sample-md-files');
    console.log(`Knowledge base initialized with ${vectorStore.getChunkCount()} chunks`);
  } catch (error) {
    console.error('Error initializing knowledge base:', error);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'RAG Agent Server is running!',
    version: '1.0.0',
    endpoints: {
      'POST /agent/message': 'Send a message to the AI agent',
      'GET /health': 'Health check',
      'GET /stats': 'Get system statistics'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      vectorStore: vectorStore.getChunkCount() > 0 ? 'ready' : 'initializing',
      sessions: sessionManager.getSessionCount(),
      plugins: pluginManager.getAllPlugins().length
    }
  });
});

app.get('/stats', (req, res) => {
  res.json({
    chunks: vectorStore.getChunkCount(),
    sessions: sessionManager.getSessionCount(),
    plugins: pluginManager.getAllPlugins().map(p => p.name)
  });
});

app.post('/agent/message', async (req, res) => {
  try {
    const { message, session_id }: AgentRequest = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sessionId = session_id || uuidv4();
    const response: AgentResponse = await agentService.processMessage({
      message,
      session_id: sessionId
    });

    res.json(response);
  } catch (error) {
    console.error('Error in /agent/message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
  try {
    // Initialize knowledge base before starting server
    await initializeKnowledgeBase();
    
    app.listen(PORT, () => {
      console.log(`🚀 RAG Agent Server running on port ${PORT}`);
      console.log(`📚 Knowledge base loaded with ${vectorStore.getChunkCount()} chunks`);
      console.log(`🔌 Available plugins: ${pluginManager.getAllPlugins().map(p => p.name).join(', ')}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 
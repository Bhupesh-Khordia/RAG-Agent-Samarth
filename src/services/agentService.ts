import { AgentRequest, AgentResponse, Message } from '../types';
import { LLMService } from './llmService';
import { VectorStore } from './vectorStore';
import { SessionManager } from './sessionManager';
import { PluginManager } from './pluginManager';

export class AgentService {
  private llmService: LLMService;
  private vectorStore: VectorStore;
  private sessionManager: SessionManager;
  private pluginManager: PluginManager;

  constructor(
    llmService: LLMService,
    vectorStore: VectorStore,
    sessionManager: SessionManager,
    pluginManager: PluginManager
  ) {
    this.llmService = llmService;
    this.vectorStore = vectorStore;
    this.sessionManager = sessionManager;
    this.pluginManager = pluginManager;
  }

  async processMessage(request: AgentRequest): Promise<AgentResponse> {
    try {
      const { message, session_id } = request;

      // Add user message to session
      const userMessage: Message = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      this.sessionManager.addMessage(session_id, userMessage);

      // Get recent conversation history
      const recentMessages = this.sessionManager.getRecentMessages(session_id, 2);

      // Search for relevant context
      const searchResults = await this.vectorStore.search(message, 3);
      const context = searchResults.length > 0 
        ? searchResults.map(result => `Source: ${result.chunk.source}\nContent: ${result.chunk.content}`).join('\n\n')
        : undefined;

      // Check for plugin intent
      const pluginIntent = this.pluginManager.detectPluginIntent(message);
      let pluginResults: string | undefined;

      if (pluginIntent && pluginIntent.confidence > 0.7) {
        const pluginResult = await this.pluginManager.executePlugin(pluginIntent.pluginName, message);
        if (pluginResult.success) {
          pluginResults = `Plugin: ${pluginIntent.pluginName}\nResult: ${JSON.stringify(pluginResult.data, null, 2)}`;
        }
      }

      // Generate system prompt
      const systemPrompt = this.generateSystemPrompt();

      // Generate response
      const response = await this.llmService.generateResponse(
        systemPrompt,
        recentMessages,
        context,
        pluginResults
      );

      // Add assistant message to session
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      this.sessionManager.addMessage(session_id, assistantMessage);

      // Prepare response
      const agentResponse: AgentResponse = {
        reply: response,
        session_id,
        context_used: searchResults.map(result => result.chunk.source),
        plugins_used: pluginIntent ? [pluginIntent.pluginName] : undefined,
        timestamp: new Date()
      };

      return agentResponse;
    } catch (error) {
      console.error('Error processing message:', error);
      throw new Error('Failed to process message');
    }
  }

  private generateSystemPrompt(): string {
    return `You are an intelligent AI assistant with access to a knowledge base and various plugins. Your capabilities include:

1. **Knowledge Base Access**: You can search through stored documents and use relevant information to answer questions.
2. **Plugin Execution**: You can use plugins for specific tasks like weather information and mathematical calculations.
3. **Conversation Memory**: You remember the context of ongoing conversations.

**Instructions:**
- Always be helpful, accurate, and concise in your responses
- When using information from the knowledge base, cite the source
- When using plugins, clearly indicate what information you're providing
- Maintain conversation context and refer to previous messages when relevant
- If you don't know something, say so rather than making up information

**Available Plugins:**
- Weather: Get weather information for any location
- Math: Evaluate mathematical expressions

**Response Format:**
- Provide clear, well-structured responses
- If using plugins, explain what you found
- If using knowledge base content, mention the source
- Keep responses conversational and natural`;
  }
} 
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '../types';

export class LLMService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  }

  async generateResponse(
    systemPrompt: string,
    messages: Message[],
    context?: string,
    pluginResults?: string
  ): Promise<string> {
    try {
      let fullPrompt = systemPrompt + '\n\n';

      // Add context if provided
      if (context) {
        fullPrompt += `Context from knowledge base:\n${context}\n\n`;
      }

      // Add plugin results if provided
      if (pluginResults) {
        fullPrompt += `Plugin results:\n${pluginResults}\n\n`;
      }

      // Add conversation history
      fullPrompt += 'Conversation history:\n';
      messages.forEach(msg => {
        fullPrompt += `${msg.role}: ${msg.content}\n`;
      });

      fullPrompt += '\nAssistant:';

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response from LLM');
    }
  }
} 
# 📝 Development Notes

## 🤖 AI-Generated vs Manual Code

### AI-Generated Components
- **Initial project structure and configuration**: Package.json, tsconfig.json, basic folder structure
- **Type definitions**: All interfaces in `src/types/index.ts`
- **Service architecture**: Core service classes (EmbeddingService, VectorStore, LLMService, etc.)
- **Plugin system**: Base plugin interface and manager
- **Document processing**: Markdown parsing and chunking logic
- **API routes**: Express server setup and endpoints
- **README documentation**: Comprehensive setup and usage guide

### Manual/Modified Components
- **Embedding service**: Switched from OpenAI to Hugging Face for free tier
- **Fallback embedding logic**: Custom hash-based embedding when API fails
- **Plugin implementations**: Weather and Math plugins with custom logic
- **Error handling**: Enhanced error handling and fallback mechanisms
- **System prompts**: Custom prompt engineering for better responses
- **Vector search**: Custom cosine similarity implementation
- **Session management**: In-memory session storage with conversation history

## 🐛 Bugs Faced and Solutions

### 1. Embedding Service Issues
**Problem**: OpenAI API is paid, needed free alternative
**Solution**: Switched to Hugging Face API with fallback to custom hash-based embeddings

**Problem**: Hugging Face API can be slow or unreliable
**Solution**: Implemented fallback embedding system using simple hash functions

### 2. TypeScript Compilation Errors
**Problem**: Missing type definitions for external libraries
**Solution**: Added proper @types packages and updated tsconfig.json

### 3. Vector Search Performance
**Problem**: Large documents causing slow search
**Solution**: Implemented chunking with 1000-character limits and similarity thresholds

### 4. Plugin Intent Detection
**Problem**: False positives in plugin detection
**Solution**: Added confidence scoring and improved regex patterns

### 5. Memory Management
**Problem**: Sessions growing indefinitely
**Solution**: Limited conversation history to last 2 messages per session

## 🔄 Agent Flow and Architecture

### Message Processing Flow
```
1. User sends message → Express server
2. AgentService.processMessage() called
3. Message added to session memory
4. Vector search for relevant context (top 3 chunks)
5. Plugin intent detection and execution
6. System prompt generation with context and plugin results
7. LLM response generation via Gemini
8. Response added to session memory
9. Return structured response with metadata
```

### Plugin Routing Logic
```typescript
// Intent detection based on keywords and patterns
detectPluginIntent(query: string): { pluginName: string; confidence: number } | null {
  const lowerQuery = query.toLowerCase();
  
  // Weather intent
  if (lowerQuery.includes('weather') || lowerQuery.includes('temperature')) {
    return { pluginName: 'weather', confidence: 0.9 };
  }
  
  // Math intent
  if (lowerQuery.match(/\d+\s*[\+\-\*\/\^\(\)]\s*\d+/)) {
    return { pluginName: 'math', confidence: 0.8 };
  }
  
  return null;
}
```

### Memory Integration
- **Session-based storage**: Each conversation maintains separate context
- **Recent history**: Last 2 messages included in LLM prompt
- **Context injection**: Relevant chunks from vector search added to prompt
- **Plugin results**: Plugin outputs injected into final prompt

### Context Retrieval Process
```typescript
// 1. Embed user query
const queryEmbedding = await embeddingService.getEmbedding(message);

// 2. Search vector store
const searchResults = await vectorStore.search(message, 3);

// 3. Format context for LLM
const context = searchResults.map(result => 
  `Source: ${result.chunk.source}\nContent: ${result.chunk.content}`
).join('\n\n');
```

## 🎯 Key Design Decisions

### 1. Free API Strategy
- **Gemini**: Free tier with generous limits
- **Hugging Face**: Free embeddings with fallback
- **Custom implementations**: Vector search, math evaluation, mock weather

### 2. In-Memory Storage
- **Pros**: Fast, simple, no external dependencies
- **Cons**: Data lost on restart, not scalable
- **Decision**: Chose simplicity for MVP, can be replaced with Redis/DB later

### 3. Plugin Architecture
- **Interface-based**: Clean separation of concerns
- **Intent detection**: Automatic routing based on content
- **Extensible**: Easy to add new plugins

### 4. Vector Search Implementation
- **Cosine similarity**: Standard approach for semantic search
- **Chunking strategy**: Sentence-based with size limits
- **Fallback embeddings**: Hash-based when API unavailable

### 5. Error Handling
- **Graceful degradation**: Fallbacks for all external services
- **User-friendly errors**: Clear error messages
- **Logging**: Comprehensive error logging for debugging

## 🚀 Performance Optimizations

### 1. Embedding Caching
- Considered but not implemented due to memory constraints
- Could be added with Redis for production

### 2. Chunk Size Optimization
- Tested different chunk sizes (500, 1000, 1500 characters)
- 1000 characters provided best balance of context and performance

### 3. Search Optimization
- Limited to top 3 results for faster response
- Could implement approximate nearest neighbor search for large datasets

### 4. Memory Management
- Limited conversation history to prevent memory bloat
- Sessions automatically cleaned up (could add TTL in production)

## 🔮 Future Improvements

### 1. Scalability
- Replace in-memory storage with Redis/PostgreSQL
- Implement proper session management with TTL
- Add connection pooling for external APIs

### 2. Enhanced Features
- Streaming responses for better UX
- File upload support for new documents
- Advanced plugin system with webhooks
- Multi-modal support (images, audio)

### 3. Performance
- Embedding caching and batching
- Approximate nearest neighbor search
- Background document processing
- Response caching

### 4. Monitoring
- Request/response logging
- Performance metrics
- Error tracking
- Usage analytics

## 📊 Testing Strategy

### Manual Testing
- **API endpoints**: Tested with curl and Postman
- **Plugin functionality**: Verified weather and math plugins
- **RAG system**: Tested with various queries against markdown content
- **Memory system**: Verified session persistence and context

### Automated Testing (Future)
- Unit tests for services
- Integration tests for API endpoints
- Performance tests for vector search
- Plugin testing framework

## 🎨 Code Quality

### TypeScript Benefits
- **Type safety**: Reduced runtime errors
- **Better IDE support**: Autocomplete and refactoring
- **Documentation**: Types serve as documentation
- **Maintainability**: Easier to understand and modify

### Code Organization
- **Separation of concerns**: Each service has single responsibility
- **Dependency injection**: Services injected where needed
- **Interface-based design**: Easy to swap implementations
- **Error handling**: Consistent error patterns throughout

### Documentation
- **Inline comments**: Key logic explained
- **README**: Comprehensive setup and usage guide
- **Type definitions**: Self-documenting interfaces
- **API documentation**: Clear endpoint descriptions 
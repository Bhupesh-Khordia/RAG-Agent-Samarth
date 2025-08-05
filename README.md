# 🧪 RAG Agent Server - AI Agent with RAG + Memory + Plugin System

A powerful TypeScript-based AI agent server that combines Retrieval-Augmented Generation (RAG), conversation memory, and a pluggable plugin system.

## 🚀 Features

- **🤖 AI Agent Core**: Powered by Google Gemini for intelligent responses
- **📚 RAG System**: Vector-based search through markdown documents
- **🧠 Memory Management**: Session-based conversation memory
- **🔌 Plugin System**: Extensible plugin architecture (Weather, Math)
- **🎯 Intent Detection**: Automatic plugin routing based on user intent
- **📊 Vector Search**: Custom cosine similarity implementation
- **🆓 Free APIs**: Uses Hugging Face for embeddings (free tier)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Express       │    │   Agent         │    │   Vector        │
│   Server        │◄──►│   Service       │◄──►│   Store         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌────────┴────────┐              │
         │              │                 │              │
         │    ┌─────────▼────────┐ ┌──────▼──────┐       │
         │    │   LLM Service    │ │  Plugin     │       │
         │    │   (Gemini)       │ │  Manager    │       │
         │    └──────────────────┘ └─────────────┘       │
         │                                              │
         │    ┌─────────────────┐    ┌─────────────────┐│
         └───►│   Session       │    │   Document      ││
              │   Manager       │    │   Processor     ││
              └─────────────────┘    └─────────────────┘│
                                                       │
              ┌─────────────────┐    ┌─────────────────┐│
              │   Embedding     │    │   Markdown      ││
              │   Service       │    │   Files         ││
              │   (HuggingFace) │    │   (sample-md-   ││
              └─────────────────┘    │   files/)       ││
                                     └─────────────────┘│
                                                        │
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │   Vector        │
                                              │   Database      │
                                              │   (In-Memory)   │
                                              └─────────────────┘
```

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Framework**: Express.js
- **LLM**: Google Gemini (free tier)
- **Embeddings**: Hugging Face (free tier)
- **Vector Search**: Custom cosine similarity
- **Document Processing**: Marked (Markdown parser)
- **Plugin System**: Custom implementation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RAG-Agent-Samarth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   # Required: Gemini API Key (free tier)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional: Hugging Face API Key (free tier)
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   
   # Optional: Weather API Key
   WEATHER_API_KEY=your_weather_api_key_here
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🎯 Usage

### API Endpoints

#### 1. Send Message to Agent

**For Unix/Linux/macOS (bash):**
```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is markdown?",
    "session_id": "user-123"
  }'
```

**For Windows (PowerShell):**
```powershell
$body = @{
    message = "What is markdown?"
    session_id = "user-123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body $body
```

**Response:**
```json
{
  "reply": "Markdown is a lightweight markup language...",
  "session_id": "user-123",
  "context_used": ["wikipedia-lightweight-markup-language.md"],
  "plugins_used": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Weather Plugin

**For Unix/Linux/macOS (bash):**
```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the weather in Bangalore?",
    "session_id": "user-123"
  }'
```

**For Windows (PowerShell):**
```powershell
$body = @{
    message = "What is the weather in Bangalore?"
    session_id = "user-123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body $body
```

#### 3. Math Plugin

**For Unix/Linux/macOS (bash):**
```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Calculate 2 + 2 * 5",
    "session_id": "user-123"
  }'
```

**For Windows (PowerShell):**
```powershell
$body = @{
    message = "Calculate 2 + 2 * 5"
    session_id = "user-123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body $body
```

#### 4. Health Check

**For Unix/Linux/macOS (bash):**
```bash
curl http://localhost:3000/health
```

**For Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
```

#### 5. System Statistics

**For Unix/Linux/macOS (bash):**
```bash
curl http://localhost:3000/stats
```

**For Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/stats" -Method GET
```

### Quick Testing Script

I've included a PowerShell script for easy testing on Windows:

```powershell
# Run the test script
.\test-app.ps1
```

This script will automatically test all major features:
- ✅ Server health check
- ✅ RAG system functionality
- ✅ Weather plugin
- ✅ Math plugin
- ✅ System statistics

### Testing Your Installation

#### Quick Test (Recommended)

**Windows:**
```powershell
# Run the automated test script
.\test-app.ps1
```

**Unix/Linux/macOS:**
```bash
# Test server health
curl http://localhost:3000/health

# Test RAG system
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is LLM-friendly content?", "session_id": "test-123"}'
```

#### Manual Testing

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Test health endpoint**:
   - Windows: `Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET`
   - Unix/Linux/macOS: `curl http://localhost:3000/health`

3. **Test agent message**:
   - Use the commands in the API Endpoints section above

4. **Check system stats**:
   - Windows: `Invoke-RestMethod -Uri "http://localhost:3000/stats" -Method GET`
   - Unix/Linux/macOS: `curl http://localhost:3000/stats`

### Sample Conversations

#### Conversation with RAG Context
```
User: "What is LLM-friendly content?"
Agent: "Based on the knowledge base, LLM-friendly content is designed to be easily parsed and understood by language models. It's clear, structured, and devoid of unnecessary complexity that could confuse the model or lead to inaccurate interpretations. The content is presented in a way that aligns with the model's processing capabilities, ensuring accurate and relevant responses. [Source: webex-boosting-ai-performance-llm-friendly-markdown.md]"
```

#### Plugin Usage
```
User: "What's the weather in Mumbai?"
Agent: "I'll check the weather for Mumbai for you. [Using weather plugin] The current weather in Mumbai is Partly Cloudy with a temperature around 28°C, humidity at 65%, and wind speed of 12 km/h."
```

## 🔌 Plugin System

### Available Plugins

1. **Weather Plugin**
   - Detects weather-related queries
   - Uses OpenWeatherMap API (or mock data)
   - Example: "weather in London", "temperature in Tokyo"

2. **Math Plugin**
   - Evaluates mathematical expressions
   - Supports basic operations: +, -, *, /, ^, ()
   - Example: "2 + 2 * 5", "calculate 10^2"

### Adding Custom Plugins

1. Create a new plugin class implementing the `Plugin` interface:
```typescript
import { Plugin, PluginResult } from '../types';

export class CustomPlugin implements Plugin {
  name = 'custom';
  description = 'Custom plugin description';

  async execute(query: string): Promise<PluginResult> {
    // Plugin logic here
    return {
      success: true,
      data: { result: 'custom result' }
    };
  }
}
```

2. Register the plugin in `PluginManager`:
```typescript
this.registerPlugin(new CustomPlugin());
```

## 📚 Knowledge Base

The system automatically processes markdown files from the `sample-md-files/` directory:

- **Document Processing**: Automatically chunks and embeds content
- **Vector Search**: Retrieves top 3 relevant chunks for each query
- **Context Injection**: Provides relevant context to the LLM

### Adding New Documents

1. Place markdown files in `sample-md-files/`
2. Restart the server
3. Documents are automatically processed and indexed

## 🧠 Memory System

- **Session-based**: Each conversation maintains its own context
- **Conversation History**: Last 10 messages are included in context (prevents memory overflow)
- **Persistent**: Sessions persist until server restart
- **Context Awareness**: Agent remembers previous messages and can refer to them
- **Automatic Cleanup**: Old messages are automatically managed to prevent memory bloat

### Memory Features

1. **Session Persistence**: Each `session_id` maintains its own conversation history
2. **Context Retention**: Agent remembers names, preferences, and previous topics
3. **Follow-up Support**: Can handle follow-up questions and references to previous messages
4. **Memory Limits**: Automatically limits to last 10 messages to prevent context overflow

### Example Conversation Flow

```
User: "My name is John"
Agent: "Nice to meet you, John! How can I help you today?"

User: "What's my name?"
Agent: "Your name is John, as you mentioned earlier in our conversation."
```

### Testing Memory

You can test the conversation memory using the included test script:

```powershell
# Run the memory test
.\test-app.ps1
```

This will test:
- ✅ Session creation and persistence
- ✅ Message history retention
- ✅ Context awareness and follow-up questions

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | No | - |
| `WEATHER_API_KEY` | OpenWeatherMap API key | No | - |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment | No | development |

### API Keys Setup

1. **Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add to `.env` file

2. **Hugging Face API Key** (optional):
   - Visit [Hugging Face](https://huggingface.co/settings/tokens)
   - Create a new token
   - Add to `.env` file

3. **Weather API Key** (optional):
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for free API key
   - Add to `.env` file



## 📊 Performance

- **Response Time**: ~2-5 seconds (depending on API calls)
- **Memory Usage**: ~100-200MB (in-memory vector store)
- **Concurrent Users**: Supports multiple sessions simultaneously

## 🔍 Troubleshooting

### Common Issues

1. **Gemini API Error**:
   - Verify API key is correct
   - Check API quota limits

2. **Embedding Service Error**:
   - Hugging Face API may be slow (uses fallback)
   - Check network connectivity

3. **Plugin Errors**:
   - Weather plugin uses mock data without API key
   - Math plugin validates expressions

4. **Windows PowerShell Issues**:
   - **"curl not recognized"**: Use `Invoke-RestMethod` instead of `curl`
   - **"Execution policy error"**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
   - **"JSON parsing error"**: Ensure proper JSON formatting in PowerShell

5. **Port Already in Use**:
   - Change `PORT` in `.env` file
   - Kill existing process: `netstat -ano | findstr :3000` then `taskkill /PID <PID>`

### Platform-Specific Commands

#### Windows (PowerShell)
```powershell
# Check if server is running
netstat -an | findstr :3000

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Test server health
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
```

#### Unix/Linux/macOS (bash)
```bash
# Check if server is running
lsof -i :3000

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Test server health
curl http://localhost:3000/health
```

### Logs

Enable debug logging by setting `NODE_ENV=development` in `.env`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## 🙏 Acknowledgments

- Google Gemini for LLM capabilities
- Hugging Face for embedding services
- Express.js for the web framework
- TypeScript for type safety 
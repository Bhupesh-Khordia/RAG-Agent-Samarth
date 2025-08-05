# 🚀 Quick Start Guide - RAG Agent Server

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
# Copy environment file
cp env.example .env

# Edit .env with your API keys
# Required: GEMINI_API_KEY
# Optional: HUGGINGFACE_API_KEY, WEATHER_API_KEY
```

### 3. Build and Run
```bash
# Build the project
npm run build

# Start development server
npm run dev
```

### 4. Test the Server
```bash
# Health check
curl http://localhost:3000/health

# Test agent
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is markdown?",
    "session_id": "test-123"
  }'
```

## 🔑 Required API Keys

### Gemini API Key (Required)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in and create API key
3. Add to `.env`: `GEMINI_API_KEY=your_key_here`

### Hugging Face API Key (Optional)
1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Create new token
3. Add to `.env`: `HUGGINGFACE_API_KEY=your_key_here`

## 🎯 Quick Test Examples

### Test RAG System

**For Unix/Linux/macOS (bash):**
```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is LLM-friendly content?",
    "session_id": "test-123"
  }'
```

**For Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body '{
  "message": "What is LLM-friendly content?",
  "session_id": "test-123"
}'
```

### Test Weather Plugin

**For Unix/Linux/macOS (bash):**
```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the weather in Mumbai?",
    "session_id": "test-123"
  }'
```

**For Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body '{
  "message": "What is the weather in Mumbai?",
  "session_id": "test-123"
}'
```

### Test Math Plugin

**For Unix/Linux/macOS (bash):**
```bash
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Calculate 2 + 2 * 5",
    "session_id": "test-123"
  }'
```

**For Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body '{
  "message": "Calculate 2 + 2 * 5",
  "session_id": "test-123"
}'
```

## 📊 System Status

Check system status:

**For Unix/Linux/macOS (bash):**
```bash
curl http://localhost:3000/stats
```

**For Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/stats" -Method GET
```

Expected response:
```json
{
  "chunks": 15,
  "sessions": 1,
  "plugins": ["weather", "math"]
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY is required"**
   - Verify API key is set in `.env` file
   - Check for typos in the key

2. **"Failed to get embedding"**
   - Hugging Face API may be slow (uses fallback)
   - Check network connectivity

3. **Port already in use**
   - Change PORT in `.env` file
   - Kill existing process on port 3000

4. **Build errors**
   - Run `npm install` again
   - Check Node.js version (18+ required)

## 📚 Next Steps

1. **Read the full documentation**: `README.md`
2. **Check deployment options**: `DEPLOYMENT.md`
3. **Review development notes**: `NOTES.md`
4. **Add custom plugins**: See plugin examples in `src/plugins/`

## 🎉 Success!

Your RAG Agent Server is now running with:
- ✅ AI Agent with Gemini
- ✅ RAG system with vector search
- ✅ Session-based memory
- ✅ Weather and Math plugins
- ✅ Free API alternatives
- ✅ TypeScript support
- ✅ Production-ready code

Happy coding! 🚀 
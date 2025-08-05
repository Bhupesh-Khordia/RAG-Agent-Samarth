# 🚀 Deployment Guide - RAG Agent Server

This guide will walk you through deploying the RAG Agent Server to various platforms.

## 📋 Prerequisites

1. **Node.js 18+** installed on your system
2. **Git** for version control
3. **API Keys** (see setup section below)
4. **Code editor** (VS Code recommended)

## 🔑 API Keys Setup

### 1. Google Gemini API Key (Required)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add to your `.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### 2. Hugging Face API Key (Optional - for better embeddings)

1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Sign up or log in
3. Click "New token"
4. Give it a name (e.g., "RAG Agent")
5. Select "Read" role
6. Copy the generated token
7. Add to your `.env` file:
   ```env
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

### 3. Weather API Key (Optional - for real weather data)

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to "API keys" section
4. Copy your API key
5. Add to your `.env` file:
   ```env
   WEATHER_API_KEY=your_weather_api_key_here
   ```

## 🏠 Local Development Setup

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd RAG-Agent-Samarth

# Install dependencies
npm install

# Copy environment file
cp env.example .env
```

### Step 2: Configure Environment

Edit the `.env` file with your API keys:

```env
# Required: Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Hugging Face API Key (for better embeddings)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Optional: Weather API Key (for real weather data)
WEATHER_API_KEY=your_weather_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Step 3: Build and Run

```bash
# Build the project
npm run build

# Start development server
npm run dev
```

### Step 4: Test the Server

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test agent endpoint
curl -X POST http://localhost:3000/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is markdown?",
    "session_id": "test-123"
  }'
```

## ☁️ Cloud Deployment Options

### Option 1: Render (Recommended - Free Tier)

1. **Create Render Account**
   - Visit [Render](https://render.com)
   - Sign up with GitHub/GitLab

2. **Connect Repository**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   ```
   Name: rag-agent-samarth
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Set Environment Variables**
   - Go to "Environment" tab
   - Add your API keys:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     HUGGINGFACE_API_KEY=your_huggingface_api_key
     WEATHER_API_KEY=your_weather_api_key
     NODE_ENV=production
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

### Option 2: Railway

1. **Create Railway Account**
   - Visit [Railway](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment**
   - Go to "Variables" tab
   - Add your API keys:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     HUGGINGFACE_API_KEY=your_huggingface_api_key
     WEATHER_API_KEY=your_weather_api_key
     NODE_ENV=production
     ```

4. **Deploy**
   - Railway will automatically detect Node.js
   - Build and deploy automatically

### Option 3: Vercel

1. **Create Vercel Account**
   - Visit [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Build Settings**
   ```
   Framework Preset: Node.js
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Set Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add your API keys

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Option 4: Replit

1. **Create Replit Account**
   - Visit [Replit](https://replit.com)
   - Sign up with GitHub

2. **Create New Repl**
   - Click "Create Repl"
   - Choose "Node.js" template
   - Import from GitHub

3. **Configure Environment**
   - Go to "Tools" → "Secrets"
   - Add your API keys:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     HUGGINGFACE_API_KEY=your_huggingface_api_key
     WEATHER_API_KEY=your_weather_api_key
     ```

4. **Deploy**
   - Click "Run"
   - Replit will start the server

## 🐳 Docker Deployment

### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

### Step 2: Build and Run

```bash
# Build Docker image
docker build -t rag-agent-samarth .

# Run container
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_gemini_api_key \
  -e HUGGINGFACE_API_KEY=your_huggingface_api_key \
  -e WEATHER_API_KEY=your_weather_api_key \
  rag-agent-samarth
```

### Step 3: Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  rag-agent:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - WEATHER_API_KEY=${WEATHER_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## 🔧 Production Configuration

### Environment Variables for Production

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional but recommended
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
WEATHER_API_KEY=your_weather_api_key_here

# Production settings
NODE_ENV=production
PORT=3000
```

### Performance Optimizations

1. **Enable Caching** (if using Redis):
   ```env
   REDIS_URL=your_redis_url
   ```

2. **Set Memory Limits**:
   ```env
   NODE_OPTIONS="--max-old-space-size=512"
   ```

3. **Enable Compression**:
   ```bash
   npm install compression
   ```

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl https://your-app-url.railway.app/health
```

### 2. Test Agent Endpoint
```bash
curl -X POST https://your-app-url.railway.app/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is markdown?",
    "session_id": "test-123"
  }'
```

### 3. Test Plugins
```bash
# Weather plugin
curl -X POST https://your-app-url.railway.app/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the weather in London?",
    "session_id": "test-123"
  }'

# Math plugin
curl -X POST https://your-app-url.railway.app/agent/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Calculate 2 + 2 * 5",
    "session_id": "test-123"
  }'
```

## 🔍 Monitoring and Debugging

### 1. Check Logs
- **Render**: Go to "Logs" tab in dashboard
- **Railway**: Go to "Deployments" → "View Logs"
- **Vercel**: Go to "Functions" → "View Logs"
- **Replit**: Check console output

### 2. Monitor Performance
- Check response times
- Monitor memory usage
- Track API call limits

### 3. Common Issues

**Issue**: "GEMINI_API_KEY is required"
- **Solution**: Verify API key is set in environment variables

**Issue**: "Failed to get embedding"
- **Solution**: Check Hugging Face API key or network connectivity

**Issue**: Slow response times
- **Solution**: Check API quotas and network latency

## 📊 Analytics and Monitoring

### 1. Basic Monitoring
- Response times
- Error rates
- API usage

### 2. Advanced Monitoring (Future)
- Request/response logging
- Performance metrics
- User analytics
- Error tracking

## 🔒 Security Considerations

### 1. API Key Security
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly

### 2. Rate Limiting
- Implement rate limiting for production
- Monitor API usage
- Set up alerts for quota limits

### 3. CORS Configuration
- Configure CORS for your domain
- Restrict access if needed

## 🚀 Scaling Considerations

### 1. Horizontal Scaling
- Use load balancers
- Implement session sharing
- Consider Redis for session storage

### 2. Vertical Scaling
- Increase memory limits
- Optimize code performance
- Use caching strategies

### 3. Database Scaling
- Replace in-memory storage with Redis/PostgreSQL
- Implement proper indexing
- Consider read replicas

## 📞 Support

If you encounter issues:

1. Check the logs for error messages
2. Verify API keys are correct
3. Test locally first
4. Check platform-specific documentation
5. Open an issue on GitHub

## 🎯 Next Steps

After successful deployment:

1. **Set up monitoring** for production
2. **Implement caching** for better performance
3. **Add authentication** if needed
4. **Scale up** based on usage
5. **Add more plugins** as needed 
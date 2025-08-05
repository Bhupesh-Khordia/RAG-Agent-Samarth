# 🚀 Render Deployment Guide

This guide will help you deploy the RAG Agent Server to Render.com successfully.

## ✅ Pre-Deployment Checklist

1. **Ensure all dependencies are in package.json**
   - ✅ All required packages are listed
   - ✅ TypeScript types are included in dependencies (not devDependencies)
   - ✅ Build script is configured

2. **Verify TypeScript configuration**
   - ✅ tsconfig.json is properly configured
   - ✅ All Node.js types are included
   - ✅ Build process works locally

3. **Environment Variables**
   - ✅ GEMINI_API_KEY (Required)
   - ✅ HUGGINGFACE_API_KEY (Optional)
   - ✅ WEATHER_API_KEY (Optional)
   - ✅ PORT (Optional, defaults to 3000)

## 🎯 Render Deployment Steps

### 1. Connect to GitHub
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `RAG-Agent-Samarth` repository

### 2. Configure the Service
```
Name: rag-agent-samarth
Environment: Node
Region: Choose closest to you
Branch: main
Root Directory: (leave empty)
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

### 3. Environment Variables
Add these in the Render dashboard:
```
GEMINI_API_KEY=your_actual_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key (optional)
WEATHER_API_KEY=your_weather_api_key (optional)
PORT=3000
NODE_ENV=production
```

### 4. Advanced Settings
- **Auto-Deploy**: Yes
- **Health Check Path**: `/health`

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   - ✅ All TypeScript types are installed in dependencies
   - ✅ tsconfig.json is properly configured
   - ✅ Dependencies are correctly listed

2. **Runtime Errors**
   - ✅ Environment variables are set
   - ✅ API keys are valid
   - ✅ Port is correctly configured

3. **TypeScript Errors**
   - ✅ @types/node is in dependencies (not devDependencies)
   - ✅ @types/express is in dependencies
   - ✅ @types/cors is in dependencies
   - ✅ @types/uuid is in dependencies

### Build Log Analysis

If you see errors like:
```
Cannot find type definition file for 'node'
Could not find a declaration file for module 'express'
Cannot find name 'process'
Cannot find name 'console'
```

**Solution**: 
- ✅ TypeScript types moved to dependencies
- ✅ tsconfig.json updated to handle types automatically
- ✅ typeRoots configured properly

## 📊 Monitoring

### Health Check
```bash
curl https://your-app-name.onrender.com/health
```

### System Stats
```bash
curl https://your-app-name.onrender.com/stats
```

## 🎉 Success Indicators

1. **Build Success**: No TypeScript compilation errors
2. **Service Start**: Application starts without errors
3. **Health Check**: `/health` endpoint returns 200
4. **API Response**: `/agent/message` endpoint works

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Render will automatically rebuild and deploy
3. Monitor the build logs for any issues

## 📞 Support

If you encounter issues:
1. Check the build logs in Render dashboard
2. Verify all environment variables are set
3. Ensure all dependencies are properly listed
4. Test locally before deploying

---

**Happy Deploying! 🚀** 
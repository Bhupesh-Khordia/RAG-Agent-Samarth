# PowerShell script to test the RAG Agent Server
# Usage: .\test-app.ps1

Write-Host "🚀 Testing RAG Agent Server" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green

# Check if server is running
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Server is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not running. Please start it first with: npm start" -ForegroundColor Red
    exit 1
}

# Test 1: RAG System
Write-Host "`n📚 Testing RAG System..." -ForegroundColor Yellow
try {
    $body = @{
        message = "What is LLM-friendly content?"
        session_id = "test-123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✅ RAG Test Response:" -ForegroundColor Green
    Write-Host $response.reply -ForegroundColor Cyan
} catch {
    Write-Host "❌ RAG Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Conversation Memory
Write-Host "`n🧠 Testing Conversation Memory..." -ForegroundColor Yellow
try {
    # First message
    $body1 = @{
        message = "My name is John"
        session_id = "memory-test-456"
    } | ConvertTo-Json

    $response1 = Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body $body1
    Write-Host "✅ First message response:" -ForegroundColor Green
    Write-Host $response1.reply -ForegroundColor Cyan

    # Second message (should remember the name)
    $body2 = @{
        message = "What is my name?"
        session_id = "memory-test-456"
    } | ConvertTo-Json

    $response2 = Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body $body2
    Write-Host "✅ Second message response (should remember name):" -ForegroundColor Green
    Write-Host $response2.reply -ForegroundColor Cyan
} catch {
    Write-Host "❌ Memory Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Weather Plugin
Write-Host "`n🌤️ Testing Weather Plugin..." -ForegroundColor Yellow
try {
    $body = @{
        message = "What is the weather in Mumbai?"
        session_id = "test-123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✅ Weather Test Response:" -ForegroundColor Green
    Write-Host $response.reply -ForegroundColor Cyan
} catch {
    Write-Host "❌ Weather Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Math Plugin
Write-Host "`n🧮 Testing Math Plugin..." -ForegroundColor Yellow
try {
    $body = @{
        message = "Calculate 2 + 2 * 5"
        session_id = "test-123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3000/agent/message" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✅ Math Test Response:" -ForegroundColor Green
    Write-Host $response.reply -ForegroundColor Cyan
} catch {
    Write-Host "❌ Math Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: System Stats
Write-Host "`n📊 Checking System Stats..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:3000/stats" -Method GET
    Write-Host "✅ System Stats:" -ForegroundColor Green
    Write-Host "   Chunks: $($stats.chunks)" -ForegroundColor Cyan
    Write-Host "   Sessions: $($stats.sessions)" -ForegroundColor Cyan
    Write-Host "   Plugins: $($stats.plugins -join ', ')" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Stats Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Testing Complete!" -ForegroundColor Green 
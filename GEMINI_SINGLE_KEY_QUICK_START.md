# ⚡ Gemini Single Key - Quick Start

## 🚀 Server Status
✅ **Running:** http://0.0.0.0:8000  
✅ **Provider:** Gemini Only  
✅ **API Key:** AIzaSyAoNJdz-rQ4p67ii1cGGgZAAZEh5LOgcy4

## 🧪 Quick Test
```bash
# Health check
curl http://localhost:8000/

# Analyze news
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"role": "Institute Owner"}'

# Get trends
curl -X POST http://localhost:8000/trends \
  -H "Content-Type: application/json" \
  -d '{"role": "Product Builder"}'

# Chat
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are AI trends?", "role": "Institute Owner"}'
```

## 📁 Configuration
- **Backend:** `backend/Market-Intelligence---The-Morning-Pulse-AI-Engine-/backend/.env`
- **Frontend:** `frontend/ai-lumina-vision/.env`
- **API Key:** `AIzaSyAoNJdz-rQ4p67ii1cGGgZAAZEh5LOgcy4`

## 🔧 Start Server
```bash
cd backend/Market-Intelligence---The-Morning-Pulse-AI-Engine-/backend
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

## 📊 Status
- **API:** ✅ Running
- **Gemini:** ✅ Configured
- **Fallback:** ✅ Active
- **Email:** ✅ Scheduled
- **Cache:** ✅ Operational

## 🎯 Endpoints
- `GET /` - Health
- `POST /analyze` - Analyze news
- `POST /trends` - Get trends
- `POST /chat` - Chatbot
- `GET /report` - Get report
- `GET /competitors` - Competitors
- `POST /refresh` - Refresh data

## ⚠️ Troubleshooting
- **Port in use:** Use port 8001
- **API key issue:** Check .env file
- **Slow response:** First request is slow (cache)

## ✅ Status
🟢 **OPERATIONAL** - Ready to use!
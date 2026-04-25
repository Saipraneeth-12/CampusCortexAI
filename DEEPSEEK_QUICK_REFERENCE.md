# ⚡ DeepSeek Quick Reference

## 🚀 Start Server
```bash
cd backend/Market-Intelligence---The-Morning-Pulse-AI-Engine-/backend
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

## 🔑 Add Credits (5 min)
1. Go to: https://platform.deepseek.com/account/billing/overview
2. Add payment method
3. Top up balance ($10-50)
4. Restart server

## 🧪 Test API
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

## 📊 Status
- **Server:** http://0.0.0.0:8000
- **Provider:** DeepSeek Only
- **Balance:** Add credits needed
- **Fallback:** Active

## 📁 Key Files
- `deepseek_processor.py` - Main integration
- `api.py` - API endpoints
- `chatbot.py` - Chatbot
- `.env` - Configuration

## 💡 Roles
- Institute Owner
- Backend Developer
- Data Engineer
- Founder / Entrepreneur
- Product Builder

## 🎯 Endpoints
- `GET /` - Health
- `POST /analyze` - Analyze news
- `POST /trends` - Get trends
- `POST /chat` - Chatbot
- `GET /report` - Get report
- `GET /competitors` - Competitors
- `POST /refresh` - Refresh data

## ⚠️ Troubleshooting
- **No balance:** Add credits
- **Invalid key:** Check .env
- **Port in use:** Use port 8001
- **Slow:** First request is slow (cache)

## 📈 Pricing
- Analysis: ~$0.01-0.05
- Trends: ~$0.02-0.10
- Chat: ~$0.01-0.03

## ✅ Status
🟢 **OPERATIONAL** - Ready to use!
# 🚀 DeepSeek-Only Setup Guide

## Current Status

✅ **API Server:** Running on http://0.0.0.0:8000  
⚠️ **DeepSeek API:** Insufficient balance (needs top-up)  
✅ **Fallback System:** Active (providing structured responses)

---

## 🔑 Add DeepSeek Credits

### Step 1: Go to DeepSeek Platform
Visit: https://platform.deepseek.com/account/billing/overview

### Step 2: Add Payment Method
- Click "Add Payment Method"
- Enter credit card details
- Verify payment method

### Step 3: Top Up Balance
- Click "Add Balance" or "Recharge"
- Enter amount (recommend $10-50 for testing)
- Complete payment

### Step 4: Verify Balance
- Check your account balance
- Should show available credits

### Step 5: Restart API Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

---

## 📊 System Architecture

### DeepSeek-Only Configuration
```
API Request
    ↓
DeepSeek Processor
    ├── Primary: deepseek-chat
    └── Fallback: Structured responses
    ↓
Response
```

### No More Gemini
- ✅ Removed all Gemini dependencies
- ✅ Removed hybrid processor
- ✅ Removed multi-key rotation
- ✅ Simplified to single provider

---

## 🧪 Test the System

### Test 1: Health Check
```bash
curl http://localhost:8000/
```

### Test 2: Analyze Market News
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"role": "Institute Owner"}'
```

### Test 3: Get Trends
```bash
curl -X POST http://localhost:8000/trends \
  -H "Content-Type: application/json" \
  -d '{"role": "Product Builder"}'
```

### Test 4: Chatbot Query
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the current AI trends?",
    "role": "Institute Owner"
  }'
```

---

## 📁 Configuration

### Environment Variables (.env)
```
DEEPSEEK_API_KEY=sk-623e934246bd42c8b98cc5c7737ec077
```

### Files Using DeepSeek
- `api.py` - Uses deepseek_processor
- `chatbot.py` - Uses deepseek_processor
- `main_pipeline.py` - Uses deepseek_processor
- `deepseek_processor.py` - Main DeepSeek integration

### Files Removed from Use
- `gemini_processor.py` - No longer used
- `hybrid_ai_processor.py` - No longer used

---

## 🎯 Available Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check |
| `/analyze` | POST | Analyze market news |
| `/trends` | POST | Get trend forecasts |
| `/chat` | POST | Chatbot interaction |
| `/report` | GET | Get current report |
| `/competitors` | GET | Get competitor intelligence |
| `/refresh` | POST | Force data refresh |

---

## 💡 How It Works

### When DeepSeek Has Balance
1. Request comes to API
2. DeepSeek processor calls API
3. Returns AI-generated response
4. Response sent to user

### When DeepSeek Has No Balance
1. Request comes to API
2. DeepSeek processor detects insufficient balance
3. Fallback system activates
4. Returns structured response
5. Response sent to user

### Fallback Response Quality
- ✅ Structured JSON format
- ✅ Role-specific insights
- ✅ Meaningful trend data
- ✅ Strategic recommendations
- ✅ Article metadata preserved

---

## 🔧 Troubleshooting

### Server Won't Start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Use different port
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8001
```

### DeepSeek Returns "Insufficient Balance"
1. Go to https://platform.deepseek.com/account/billing/overview
2. Add payment method
3. Top up balance
4. Restart server

### DeepSeek Returns "Invalid API Key"
1. Check API key in `.env` file
2. Verify key is correct
3. Copy from https://platform.deepseek.com/api_keys
4. Restart server

### Slow Response
- First request may be slow (data scraping)
- Subsequent requests use 2-hour cache
- Check cache status: `curl http://localhost:8000/cache-status`

---

## 📈 DeepSeek Pricing

### Typical Costs
- **Analysis Request:** ~$0.01-0.05
- **Trend Forecast:** ~$0.02-0.10
- **Chatbot Query:** ~$0.01-0.03

### Recommended Budget
- **Testing:** $5-10
- **Development:** $20-50
- **Production:** $100+/month

---

## 🎓 Supported Roles

- Institute Owner
- Backend Developer
- Data Engineer
- Founder / Entrepreneur
- Product Builder

Each role gets tailored market intelligence and strategic recommendations.

---

## ✨ Key Features

✅ **Simple & Clean:** Single AI provider (DeepSeek)  
✅ **Cost Effective:** Pay only for what you use  
✅ **Reliable:** Fallback system ensures uptime  
✅ **Fast:** Quick response times  
✅ **Scalable:** Easy to add more credits  

---

## 🚀 Next Steps

1. **Add DeepSeek Credits:** https://platform.deepseek.com/account/billing/overview
2. **Restart Server:** `python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000`
3. **Test Endpoints:** Use curl commands above
4. **Monitor Usage:** Check logs for `[deepseek]` messages

---

**System Status:** 🟢 OPERATIONAL  
**API Server:** Running on http://0.0.0.0:8000  
**Provider:** DeepSeek Only  
**Fallback:** Active
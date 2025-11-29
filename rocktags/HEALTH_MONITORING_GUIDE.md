# 🏥 Health Monitoring Endpoint - Complete Guide

## Quick Start

### **1. Check Health Status (Browser)**

Simply open this URL in your browser:
```
http://localhost:3000/api/health
```

You'll see a JSON response like:
```json
{
  "status": "healthy",
  "backend": "up",
  "apiLatency": "143ms",
  "backendLatency": "143ms",
  "timestamp": "2025-11-29T01:40:00.052Z",
  "environment": {
    "nodeEnv": "development",
    "hasTrackerKey": true
  }
}
```

---

## **2. Monitor Health via Terminal (Live Monitoring)**

### **Option A: Watch Every 5 Seconds**
```bash
watch -n 5 'curl -s http://localhost:3000/api/health | jq .'
```

**Output:**
```
Every 5.0s: curl -s http://localhost:3000/api/health | jq .

{
  "status": "healthy",
  "backend": "up",
  "apiLatency": "143ms",
  "backendLatency": "143ms",
  "timestamp": "2025-11-29T01:40:02.123Z",
  "environment": {
    "nodeEnv": "development",
    "hasTrackerKey": true
  }
}
```

### **Option B: One-Time Check**
```bash
curl -s http://localhost:3000/api/health | jq .
```

### **Option C: Pretty Print with Details**
```bash
curl -s http://localhost:3000/api/health | jq '{
  status: .status,
  backend: .backend,
  latency: .apiLatency,
  uptime: .timestamp
}'
```

---

## **3. Monitor in Production**

### **Production URL:**
Replace `localhost:3000` with your production domain:
```
https://your-production-api.com/api/health
```

### **Example (using your real domain):**
```bash
curl -s https://rocktags-api.example.com/api/health | jq .
```

---

## **4. Set Up Automated Monitoring**

### **Option A: Simple Shell Script (Check Every Minute)**

Create file `monitor-health.sh`:
```bash
#!/bin/bash

while true; do
  RESPONSE=$(curl -s http://localhost:3000/api/health)
  STATUS=$(echo $RESPONSE | jq -r '.status')
  BACKEND=$(echo $RESPONSE | jq -r '.backend')
  TIMESTAMP=$(echo $RESPONSE | jq -r '.timestamp')
  
  echo "[$TIMESTAMP] Status: $STATUS | Backend: $BACKEND"
  
  # Alert if unhealthy
  if [ "$STATUS" != "healthy" ]; then
    echo "⚠️  ALERT: API is $STATUS!"
  fi
  
  sleep 60
done
```

Run it:
```bash
chmod +x monitor-health.sh
./monitor-health.sh
```

---

### **Option B: Using `curl` with Webhook Alert (Discord/Slack)**

```bash
#!/bin/bash

HEALTH_URL="http://localhost:3000/api/health"
WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

RESPONSE=$(curl -s $HEALTH_URL)
STATUS=$(echo $RESPONSE | jq -r '.status')

if [ "$STATUS" != "healthy" ]; then
  curl -X POST $WEBHOOK_URL \
    -H 'Content-Type: application/json' \
    -d "{\"text\": \"⚠️ API Alert: Status is $STATUS\"}"
fi
```

---

## **5. What Each Field Means**

| Field | Meaning | Values |
|-------|---------|--------|
| `status` | Overall API health | `healthy` or `degraded` or `unhealthy` |
| `backend` | Backend service status | `up` or `down` |
| `apiLatency` | Time for health check request | e.g., `143ms` |
| `backendLatency` | Time to reach backend | e.g., `143ms` or `timeout` |
| `timestamp` | When check was performed | ISO 8601 format |
| `environment.nodeEnv` | Deployment environment | `development` or `production` |
| `environment.hasTrackerKey` | Private key is configured | `true` or `false` |

---

## **6. Interpret the Response**

### **✅ Healthy Response:**
```json
{
  "status": "healthy",
  "backend": "up",
  "apiLatency": "50ms",
  "backendLatency": "40ms"
}
```
✅ Everything is working perfectly!

### **⚠️ Degraded Response:**
```json
{
  "status": "degraded",
  "backend": "down",
  "apiLatency": "100ms",
  "backendLatency": "timeout"
}
```
⚠️ API is running but backend is unreachable (expected fallback to static positions)

### **❌ Unhealthy Response:**
```json
{
  "status": "unhealthy",
  "error": "Network error or API crash"
}
```
❌ The API itself is broken - needs attention!

---

## **7. Real-World Monitoring Setup**

### **Option A: Uptime Robot (Recommended for Production)**

1. Go to https://uptimerobot.com
2. Sign up (free tier available)
3. Add new monitor:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://your-api.com/api/health`
   - **Check Interval**: Every 5 minutes
   - **Alerts**: Email/SMS if down
4. Done! You'll get notifications if health check fails

### **Option B: GitHub Actions (Automated Checks)**

Create `.github/workflows/health-check.yml`:
```yaml
name: Health Check

on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes

jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - name: Check API Health
        run: |
          RESPONSE=$(curl -s https://your-api.com/api/health)
          STATUS=$(echo $RESPONSE | jq -r '.status')
          
          if [ "$STATUS" != "healthy" ]; then
            echo "❌ API is not healthy!"
            exit 1
          fi
          echo "✅ API is healthy"
```

### **Option C: Sentry Integration (Error Tracking)**

1. Install Sentry SDK:
```bash
npm install @sentry/nextjs
```

2. Add to `src/app/api/health/route.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  try {
    // ... health check logic ...
    Sentry.captureMessage("Health check passed", "info");
    return Response.json({ status: "healthy" });
  } catch (error) {
    Sentry.captureException(error);
    return Response.json({ status: "unhealthy" }, { status: 503 });
  }
}
```

Then view on Sentry dashboard: https://sentry.io

---

## **8. Sample Dashboard Script**

Create `health-dashboard.sh` to see all metrics:

```bash
#!/bin/bash

echo "🏥 RockTags API Health Dashboard"
echo "=================================="

while true; do
  clear
  
  RESPONSE=$(curl -s http://localhost:3000/api/health)
  STATUS=$(echo $RESPONSE | jq -r '.status')
  BACKEND=$(echo $RESPONSE | jq -r '.backend')
  API_LATENCY=$(echo $RESPONSE | jq -r '.apiLatency')
  BACKEND_LATENCY=$(echo $RESPONSE | jq -r '.backendLatency')
  TIMESTAMP=$(echo $RESPONSE | jq -r '.timestamp')
  
  echo "Status:           $STATUS"
  echo "Backend:          $BACKEND"
  echo "API Latency:      $API_LATENCY"
  echo "Backend Latency:  $BACKEND_LATENCY"
  echo "Last Updated:     $TIMESTAMP"
  echo ""
  echo "Refreshing in 5 seconds... (Ctrl+C to exit)"
  echo "=================================="
  
  sleep 5
done
```

Run it:
```bash
chmod +x health-dashboard.sh
./health-dashboard.sh
```

---

## **9. Common Issues & Solutions**

### **Issue: "Connection refused" error**
```
curl: (7) Failed to connect to localhost port 3000
```
**Solution**: Make sure the dev server is running:
```bash
npm run dev
```

### **Issue: "Backend Latency: timeout"**
```json
{
  "status": "degraded",
  "backend": "down",
  "backendLatency": "timeout"
}
```
**Solution**: This is expected! The backend might be temporarily down. The app will use static positions gracefully.

### **Issue: "hasTrackerKey: false"**
```json
{
  "environment": {
    "hasTrackerKey": false
  }
}
```
**Solution**: Make sure `.env.local` has `CAT1_TRACKER_KEY` configured.

---

## **10. Quick Commands Cheat Sheet**

```bash
# Check health once
curl http://localhost:3000/api/health | jq .

# Watch health every 5 seconds
watch -n 5 'curl -s http://localhost:3000/api/health | jq .'

# Check just the status
curl -s http://localhost:3000/api/health | jq '.status'

# Check backend status
curl -s http://localhost:3000/api/health | jq '.backend'

# Check latencies
curl -s http://localhost:3000/api/health | jq '{api: .apiLatency, backend: .backendLatency}'

# Pretty format
curl -s http://localhost:3000/api/health | jq 'with_entries(.key |= "  \(.)" | .value |= tostring) | to_entries | .[] | .key + ": " + .value'
```

---

## **Summary**

| Method | Use Case | Effort |
|--------|----------|--------|
| **Browser** | Quick check | ⭐ (30 seconds) |
| **curl command** | Manual monitoring | ⭐⭐ (1 minute) |
| **Shell script** | Automated alerts | ⭐⭐⭐ (30 minutes) |
| **Uptime Robot** | Production monitoring | ⭐⭐⭐ (30 minutes) |
| **GitHub Actions** | CI/CD integration | ⭐⭐⭐⭐ (1 hour) |
| **Sentry** | Error tracking + monitoring | ⭐⭐⭐⭐⭐ (2 hours) |

**Recommended**: Start with **Browser + curl**, upgrade to **Uptime Robot** for production! 🚀

---

## **Next Steps**

1. ✅ Open browser: `http://localhost:3000/api/health`
2. ✅ Try terminal: `curl http://localhost:3000/api/health | jq .`
3. ✅ For production: Set up Uptime Robot account
4. ✅ Add GitHub Actions for automated checks

Your API is now observable! 📊

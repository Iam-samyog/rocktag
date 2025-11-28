# Tracker API - Troubleshooting Guide

## Issue: "Failed to fetch" Error

### What's Happening
The map is trying to fetch real-time cat locations from your backend API but the request is failing.

### Common Causes & Solutions

#### 1. **CORS (Cross-Origin) Error**
**Symptom:** Browser console shows "Failed to fetch" with no additional details

**Solutions:**
- ✅ **Backend Needs CORS Headers**: Your API must include these headers:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: POST
  Access-Control-Allow-Headers: Content-Type
  ```
- ✅ **Contact Backend Team**: Ask them to enable CORS on the endpoint
- ✅ **Use Backend Proxy** (Temporary): Create a Next.js API route that proxies requests

---

#### 2. **Network Connectivity**
**Symptom:** API endpoint is unreachable

**Solutions:**
- ✅ **Check API URL**: Verify the endpoint is correct
  - Current: `https://rocktags-backend-147809513475.us-south1.run.app/findmy/`
- ✅ **Test with cURL/Postman**:
  ```bash
  curl -X POST https://rocktags-backend-147809513475.us-south1.run.app/findmy/ \
    -H "Content-Type: application/json" \
    -d '{"trackers":[{"name":"cat1","privateKey":"E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg=="}]}'
  ```
- ✅ **Check if API is running**: Verify the backend service is active

---

#### 3. **Invalid Private Key**
**Symptom:** API returns 400 or 401 error

**Solutions:**
- ✅ **Verify Private Key**: Check that the key in `campus-data.json` matches what your backend expects
- ✅ **Check Key Format**: Ensure it's base64 encoded: `E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg==`
- ✅ **Update Key**: If you have a new key, update `public/data/campus-data.json`:
  ```json
  {
    "id": 1,
    "name": "cat1",
    "privateKey": "YOUR_NEW_KEY_HERE"
  }
  ```

---

### Debug Steps

**1. Check Browser Console**
- Open DevTools (F12)
- Look for "Fetching tracker locations from:" log
- Check what data is being sent

**2. Check Network Tab**
- Open DevTools → Network tab
- Reload the page
- Look for POST request to `/findmy/`
- Check response status and body

**3. Check Application Logs**
- Console shows: `Fetching tracker locations from: [URL]`
- Console shows: `Sending trackers: [data]`
- Console shows: `Tracker API response: [response]` (if successful)

**4. Temporary Workaround**
If API is down, the cat will still show on the map using static coordinates from `campus-data.json`

---

### Current Status

**Static Fallback Data (campus-data.json):**
```json
{
  "name": "cat1",
  "lat": 32.692513,
  "lng": -97.0764474
}
```

**Expected Real-Time Data (from API):**
```json
{
  "cat1": {
    "latitude": 32.692513,
    "longitude": -97.0764474,
    "timestamp": "2025-11-27T22:55:53+00:00",
    "status": 32
  }
}
```

---

### Configuration Files

**Update API URL** (if needed):
Edit `rocktags/.env.local` or create it:
```
NEXT_PUBLIC_TRACKER_API_URL=https://your-new-api-url/findmy/
NEXT_PUBLIC_TRACKER_TIMEOUT=10000
```

---

### Next Steps

1. **Verify API is Working**: Test the endpoint with cURL/Postman
2. **Check CORS**: Ensure backend sends CORS headers
3. **Verify Key Format**: Make sure private key is correct
4. **Check Logs**: Review browser console and network tab
5. **Contact Backend Team**: Share this guide with them if needed

---

### Quick Test

To test if the API would work if CORS is enabled:

```typescript
// In browser console:
fetch('https://rocktags-backend-147809513475.us-south1.run.app/findmy/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    trackers: [{
      name: 'cat1',
      privateKey: 'E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg=='
    }]
  })
}).then(r => r.json()).then(console.log).catch(console.error);
```

---

## For Now

The cat **will display on the map** at the static coordinates from `campus-data.json`. Once the API is working, it will update every 10 seconds with real-time coordinates! 🐱📍

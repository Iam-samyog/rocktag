# Real-Time Tracking Debug Guide

## How to Check if Real-Time Tracking is Working

### 1. Open Browser Developer Tools
1. Open the map page: `http://localhost:3000/main/map`
2. Press **F12** or **Cmd+Option+I** (Mac) to open Developer Tools
3. Go to the **Console** tab

### 2. Look for These Log Messages

You should see logs appearing every 10 seconds:

```
🔄 Updating tracker locations for: [{name: "cat1", privateKey: "E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg=="}]
Fetching tracker locations from: /api/tracker
Sending trackers: [{name: "cat1", privateKey: "E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg=="}]
📍 Received tracker locations: {cat1: {latitude: 32.7315, longitude: -97.1110, ...}}
✅ Updating cat1 to: {latitude: 32.7315, longitude: -97.1110, timestamp: "2025-11-28T...", status: 0}
```

### 3. Network Tab Monitoring

To verify API calls are being made:

1. Go to the **Network** tab in Developer Tools
2. Filter by "tracker"
3. You should see **POST** requests to `/api/tracker` appearing every 10 seconds
4. Each request should have:
   - **Status**: 200 (success) or 500 (error)
   - **Body**: Contains the tracker array with name and privateKey
   - **Response**: Should contain cat location data

### 4. Expected Response Format

If tracking is working, the backend response should look like:

```json
{
  "cat1": {
    "latitude": 32.7315,
    "longitude": -97.1110,
    "timestamp": "2025-11-28T15:30:45.123Z",
    "status": 0
  }
}
```

### 5. Troubleshooting

#### Problem: No logs appearing in console
- ✅ Check: Is the page fully loaded?
- ✅ Check: Are there any JavaScript errors in the console?
- ✅ Check: Is the map data loaded? Look for campus-data.json logs

#### Problem: API calls showing 500 error
- ✅ Check backend logs for errors
- ✅ Verify privateKey is correct: `E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg==`
- ✅ Verify backend endpoint is accessible

#### Problem: API returns 200 but no location data
- ✅ The privateKey might be invalid or the cat isn't being tracked
- ✅ Check if the backend tracker service is running
- ✅ Test with cURL:

```bash
curl -X POST "https://rocktags-backend-147809513475.us-south1.run.app/findmy/" \
  -H "Content-Type: application/json" \
  -d '[{"name":"cat1","privateKey":"E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg=="}]'
```

### 6. Map Verification

Once tracking is working:
- ✅ The cat marker should move on the map every 10 seconds
- ✅ Check the map for "lastUpdated" timestamp in the cat's info window
- ✅ If `isRealTime: true` is set, the cat is receiving live data

## Key Components

### Backend: `/api/tracker` (Next.js API Route)
- **Location**: `src/app/api/tracker/route.ts`
- **Function**: Proxies requests to the backend tracker service
- **Request**: `POST` with `{ trackers: [...] }`
- **Response**: `{ catName: { latitude, longitude, timestamp, status } }`

### Frontend: Tracker API Service
- **Location**: `src/lib/trackerApi.ts`
- **Function**: Fetches and formats tracker data
- **Polling**: Every 10 seconds via `useEffect` interval

### Frontend: Map Page
- **Location**: `src/app/main/map/page.tsx`
- **Function**: Manages real-time updates and cat position synchronization
- **Logging**: Enhanced with emoji-prefixed messages for easy identification

## Manual Testing

### Test 1: Static Data Load
Check if the initial cat position loads:
```javascript
// In browser console
localStorage.setItem('debug', 'true');
// Refresh and check logs
```

### Test 2: API Connectivity
```javascript
// In browser console
fetch('/api/tracker', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    trackers: [
      { name: 'cat1', privateKey: 'E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg==' }
    ]
  })
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));
```

### Test 3: Check Stored Cat Data
```javascript
// In browser console - verify cat has privateKey
const campusData = await fetch('/data/campus-data.json').then(r => r.json());
console.log('Cats in campusData:', campusData.cats);
console.log('cat1 has privateKey?', campusData.cats[0].privateKey);
```

## Success Indicators

✅ **All of these should be true:**
1. Console shows "🔄 Updating tracker locations..." every 10 seconds
2. Network tab shows POST /api/tracker requests with 200 status
3. Each response contains valid latitude/longitude coordinates
4. Cat marker position updates on the map
5. No errors in the browser console

## Questions?

Check the logs in:
- **Browser Console**: Frontend logs with 🔄📍✅ emojis
- **Next.js Terminal**: Server-side logs from API route
- **Backend Logs**: Check if the tracker service is responding

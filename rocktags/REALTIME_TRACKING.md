# Real-Time Cat Tracker Integration

## Overview
This system integrates real-time GPS tracking for campus cats. The map automatically fetches and updates cat locations every 10 seconds from the backend tracker API.

## How It Works

### 1. **Backend API**
- **Endpoint:** `https://rocktags-backend-147809513475.us-south1.run.app/findmy/`
- **Method:** POST
- **Purpose:** Returns real-time GPS coordinates for tracked cats

### 2. **Data Flow**
```
Campus Data (JSON) 
    ↓
Add Private Keys to Cats
    ↓
Map Page Loads
    ↓
Fetch Tracker Locations (every 10 seconds)
    ↓
Update Cat Positions on Map
    ↓
Display Real-Time Locations
```

### 3. **Request Format**
```json
{
  "trackers": [
    {
      "name": "cat1",
      "privateKey": "E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg=="
    },
    {
      "name": "cat2",
      "privateKey": "YOUR_KEY_HERE"
    }
  ]
}
```

### 4. **Response Format**
```json
{
  "cat1": {
    "latitude": 32.692513,
    "longitude": -97.0764474,
    "timestamp": "2025-11-27T22:55:53+00:00",
    "status": 32
  },
  "cat2": {
    "latitude": 32.700123,
    "longitude": -97.115456,
    "timestamp": "2025-11-27T22:55:53+00:00",
    "status": 32
  }
}
```

## Setup Instructions

### Step 1: Add Private Keys to Campus Data
Edit `/public/data/campus-data.json` and add `privateKey` field to each cat:

```json
{
  "id": 1,
  "name": "Microwave",
  "privateKey": "E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg==",
  ...
}
```

### Step 2: Implementation
The real-time tracking is automatically implemented in:
- **Map Page:** `src/app/main/map/page.tsx`
- **Tracker Service:** `src/lib/trackerApi.ts`
- **Types:** `src/types/index.ts`

### Step 3: Testing
1. Deploy or run the development server
2. Navigate to the map page
3. You should see a "🔄 Updating real-time tracker locations..." indicator
4. Cat positions will update every 10 seconds

## Features

✅ **Real-Time Updates**: Fetches new positions every 10 seconds
✅ **Automatic Fallback**: Uses static data if tracker API fails
✅ **Error Handling**: Gracefully handles API errors without breaking the UI
✅ **Performance**: Only updates cats that have private keys configured
✅ **Status Indicator**: Shows when locations are being updated

## Configuration

### Update Frequency
To change the update interval (currently 10 seconds):

Edit `src/app/main/map/page.tsx`:
```typescript
// Change from 10000 (10 seconds) to desired milliseconds
const interval = setInterval(updateTrackerLocations, 10000); // Change this value
```

### Environment Variables (if needed in future)
Consider adding environment variables for:
- API URL
- Update interval
- API timeout

## Troubleshooting

### Cats Not Updating
1. Check if `privateKey` is set in campus-data.json
2. Verify the backend API is accessible
3. Check browser console for errors

### All Cats Static
- No cats have `privateKey` configured
- Backend API is unreachable
- Check network requests in DevTools

### API Errors
- Verify privateKey format matches backend expectations
- Check if API endpoint is correct
- Ensure CORS is enabled on backend

## File Structure
```
src/
├── app/
│   └── main/
│       └── map/
│           ├── page.tsx (Updated with real-time fetching)
│           └── types.ts
├── components/
│   └── MapWithCatsAndBuildings.tsx (Displays dynamic positions)
├── lib/
│   └── trackerApi.ts (NEW - API service)
└── types/
    └── index.ts (Updated Cat interface)

public/
└── data/
    └── campus-data.json (Add privateKey fields)
```

## Next Steps

1. **Get Private Keys**: Obtain tracker private keys from your backend team
2. **Update Config**: Add keys to campus-data.json
3. **Test**: Verify real-time updates work
4. **Optimize**: Adjust update frequency based on backend capacity
5. **Monitor**: Track API usage and performance

## Security Notes
- Private keys should never be exposed to the client in production
- Consider moving sensitive config to backend
- Use environment variables for API endpoints

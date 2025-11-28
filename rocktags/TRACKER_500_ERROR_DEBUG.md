# Troubleshooting 500 Internal Server Error

## What This Means
The backend is receiving your request but encountering an error while processing it. This is different from the 422 error (bad format) - the format is now correct, but the backend can't process it.

## Common Causes

### 1. **Invalid or Mismatched Private Key**
The privateKey in `campus-data.json` must exactly match what the backend has registered for that cat.

**Check:**
```javascript
// In browser console, check what key we're sending:
const campusData = await fetch('/data/campus-data.json').then(r => r.json());
console.log('Cat 1 privateKey:', campusData.cats[0].privateKey);
```

Currently: `E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg==`

**Solution:** Verify this key is correct in the backend system.

---

### 2. **Cat Name Doesn't Exist in Backend**
The backend might not have a tracker registered with the name "cat1".

**Check:**
- Does the backend have a tracker with name: `cat1`?
- If not, you may need to register it first or use a different name

---

### 3. **Backend Service Issue**
The tracker service might not be running or the database is unreachable.

**Check:**
- Is the backend running? Test with a simple cURL:
```bash
curl -X POST "https://rocktags-backend-147809513475.us-south1.run.app/findmy/" \
  -H "Content-Type: application/json" \
  -d '{"trackers":[{"name":"cat1","privateKey":"E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg=="}]}'
```

- Check backend logs for detailed error messages
- Verify database connection is active

---

### 4. **Request Format Still Incorrect**
Even though we fixed it, double-check the exact format being sent.

**Check in browser console (F12):**
Look for these logs:
```
📊 Tracker details: {
  count: 1,
  names: ["cat1"],
  keys: ["E5kjUrGAdT6..."]
}
📤 Request body being sent: {"trackers":[{"name":"cat1","privateKey":"E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg=="}]}
```

If the format looks wrong, something's still off.

---

## Debugging Steps

### Step 1: Check Current Logs
**In browser console (F12):**
1. Refresh the page
2. Look for all logs starting with 🔄, 📋, 📊, 📤, 📥, ✅, ❌
3. Copy the complete log output and share it

### Step 2: Test Backend Directly
```bash
# Test with exact same data
curl -X POST "https://rocktags-backend-147809513475.us-south1.run.app/findmy/" \
  -H "Content-Type: application/json" \
  -d '{"trackers":[{"name":"cat1","privateKey":"E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg=="}]}'
```

What's the exact response? Share it.

### Step 3: Check Backend Status
- Is the backend service running?
- Are there any backend logs showing errors?
- Can you access the backend health check endpoint (if it exists)?

---

## What's Working Now (Fallback)
Even if real-time tracking fails with a 500 error:
- ✅ Map still displays
- ✅ Cat shows at static position: `32.7315, -97.1110`
- ✅ Buildings display correctly
- ⚠️ Real-time updates don't work (cat won't move)

The map won't break, but you won't get live tracking until the backend issue is resolved.

---

## Next Actions

**Contact Backend Team:**
1. Share the 500 error from the logs
2. Verify "cat1" is registered in the system
3. Confirm the privateKey: `E5kjUrGAdT6kP2tRie73RbABIrRRNJICu0fwWg==` is correct
4. Check if the tracker service is running and database is connected
5. Provide any detailed error logs from the backend

**or**

**Test the endpoint yourself with cURL** (as shown above) and share the exact error response from the backend.

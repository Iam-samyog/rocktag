# Frontend API Testing Guide

## 🚀 Quick Start

You have **3 ways** to test your frontend APIs:

---

## **Option 1: Use the Web Test Dashboard** ✅ (Recommended)

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the test page:**
   ```
   http://localhost:3000/api-test
   ```

3. **Click "Run API Tests"** and view results in real-time

### What it tests:
- ✅ GET `/api/users` endpoint
- ✅ API response time
- ✅ Error handling (404 responses)
- ✅ Response headers validation
- ✅ User data structure validation

---

## **Option 2: Browser Console** (Quick Test)

1. **Open DevTools** (F12 or Cmd+Option+I)

2. **Go to Console tab**

3. **Copy and paste:**
   ```javascript
   async function testAPIs() {
     console.log("🚀 Testing /api/users...");
     try {
       const response = await fetch("/api/users");
       const data = await response.json();
       console.log("✅ Status:", response.status);
       console.log("✅ Users Count:", data.length);
       console.log("✅ First User:", data[0]);
       console.log("✅ API is working!");
       return data;
     } catch (error) {
       console.error("❌ API Error:", error);
     }
   }
   testAPIs();
   ```

4. **Watch the console output**

---

## **Option 3: Node.js Command Line** (Headless Testing)

1. **Create a test script:**
   ```bash
   cat > test-api.js << 'EOF'
   async function testAPIs() {
     console.log("🚀 Testing Frontend APIs...\n");
     
     try {
       const baseURL = "http://localhost:3000";
       
       // Test /api/users
       console.log("Testing GET /api/users...");
       const response = await fetch(`${baseURL}/api/users`);
       const data = await response.json();
       
       console.log("✅ Status:", response.status);
       console.log("✅ Users Count:", data.length);
       console.log("✅ First User:", JSON.stringify(data[0], null, 2));
       
       if (response.status === 200 && Array.isArray(data)) {
         console.log("\n✨ API is working perfectly!");
         return true;
       }
     } catch (error) {
       console.error("❌ Error:", error.message);
       return false;
     }
   }
   
   testAPIs();
   EOF
   ```

2. **Run the test:**
   ```bash
   node test-api.js
   ```

---

## 📊 Expected Test Results

### ✅ Success Response (200 OK):
```json
{
  "status": 200,
  "ok": true,
  "data": [
    {
      "id": "user1",
      "email": "user@example.com",
      "role": "Admin"
    },
    ...
  ]
}
```

### ❌ Error Response (404 Not Found):
```json
{
  "status": 404,
  "statusText": "Not Found"
}
```

---

## 🧪 What Gets Tested

| Test | Endpoint | Expected Result |
|------|----------|-----------------|
| Users List | `GET /api/users` | ✅ 200 OK, Array of users |
| Response Time | `GET /api/users` | ✅ < 1000ms |
| Headers | `GET /api/users` | ✅ `application/json` |
| 404 Handling | `GET /api/nonexistent` | ✅ 404 status |
| Data Structure | `GET /api/users` | ✅ Contains email & role |

---

## 🔧 Troubleshooting

### **API Returns 404**
- ✅ Check if the endpoint exists on your backend
- ✅ Verify route handlers are properly configured
- ✅ Check Firebase/database connection

### **CORS Error**
- ✅ Ensure CORS is enabled on your backend
- ✅ Check allowed origins in your API configuration
- ✅ Verify environment variables

### **Connection Timeout**
- ✅ Ensure dev server is running (`npm run dev`)
- ✅ Check if API server is responsive
- ✅ Verify network connectivity

### **Empty User List**
- ✅ Check if database has any users
- ✅ Verify database connection
- ✅ Check API query filters

---

## 📝 Manual Testing Checklist

- [ ] Can fetch `/api/users` successfully
- [ ] Response includes all user fields
- [ ] Response time is acceptable
- [ ] Admin role detection works
- [ ] Authentication endpoints respond
- [ ] Error responses are handled gracefully

---

## 💡 Pro Tips

**Monitor in Real-Time:**
```javascript
// In browser console, run tests every 5 seconds
setInterval(testFrontendAPIs, 5000);
```

**Test with Different Data:**
```javascript
// Fetch specific user
fetch("/api/users?email=test@example.com")
  .then(r => r.json())
  .then(data => console.log(data));
```

**Log Network Traffic:**
- Open DevTools → Network tab
- Trigger API calls
- Check request/response details

---

## ❓ Questions?

If APIs are failing:
1. Check browser console for errors
2. Verify backend is running
3. Check network tab in DevTools
4. Review API route handlers
5. Verify database connection


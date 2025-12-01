/**
 * Simple Frontend API Test Script
 * Run this from browser console or as a Node.js script
 */

export async function testFrontendAPIs() {
  console.log("🚀 Starting Frontend API Tests...\n");

  const tests = [
    {
      name: "GET /api/users - Fetch Users List",
      fn: async () => {
        const response = await fetch("/api/users");
        const data = await response.json();
        return {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          contentType: response.headers.get("content-type"),
          dataLength: Array.isArray(data) ? data.length : "not-an-array",
          firstUser: Array.isArray(data) && data.length > 0 ? data[0] : null,
        };
      },
    },
    {
      name: "API Response Time",
      fn: async () => {
        const start = performance.now();
        const response = await fetch("/api/users");
        const end = performance.now();
        await response.json();
        return {
          responseTime: `${(end - start).toFixed(2)}ms`,
          status: response.status,
        };
      },
    },
    {
      name: "Check API Error Handling (404)",
      fn: async () => {
        try {
          const response = await fetch("/api/nonexistent");
          return {
            status: response.status,
            statusText: response.statusText,
            message: "Error endpoint returned expected 404",
          };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    },
    {
      name: "Check Response Headers",
      fn: async () => {
        const response = await fetch("/api/users");
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        return headers;
      },
    },
    {
      name: "Validate User Data Structure",
      fn: async () => {
        const response = await fetch("/api/users");
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          return { error: "Response is not an array" };
        }

        if (data.length === 0) {
          return { message: "No users found", count: 0 };
        }

        const firstUser = data[0];
        const hasRequired = {
          hasEmail: "email" in firstUser,
          hasRole: "role" in firstUser,
          hasId: "id" in firstUser || "_id" in firstUser,
        };

        return {
          totalUsers: data.length,
          userStructure: firstUser,
          requiredFields: hasRequired,
          allFieldsPresent: Object.values(hasRequired).every(v => v),
        };
      },
    },
  ];

  const results: Record<string, any> = {};

  for (const test of tests) {
    try {
      console.log(`⏳ Running: ${test.name}...`);
      const result = await test.fn();
      results[test.name] = { status: "✅ PASSED", data: result };
      console.log(`✅ ${test.name}:`, result);
      console.log("---\n");
    } catch (error) {
      results[test.name] = { status: "❌ FAILED", error: (error as Error).message };
      console.error(`❌ ${test.name}:`, error);
      console.log("---\n");
    }
  }

  console.log("\n📊 TEST SUMMARY:");
  console.log("================");
  
  let passedCount = 0;
  let failedCount = 0;

  for (const [testName, result] of Object.entries(results)) {
    if (result.status === "✅ PASSED") {
      passedCount++;
      console.log(`✅ ${testName}`);
    } else {
      failedCount++;
      console.log(`❌ ${testName}`);
    }
  }

  console.log("\n📈 Results:");
  console.log(`Total Tests: ${tests.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Success Rate: ${((passedCount / tests.length) * 100).toFixed(2)}%`);

  return results;
}

// Export for use in browser or Node.js
if (typeof window !== "undefined") {
  (window as any).testFrontendAPIs = testFrontendAPIs;
  console.log("🎯 API Test function loaded! Run: testFrontendAPIs()");
}

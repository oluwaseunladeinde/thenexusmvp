// Quick test script for Introduction Request APIs
// Run with: node test-intro-apis.js

const BASE_URL = 'http://localhost:3000';

async function testAPIs() {
    console.log('🧪 Testing Introduction Request APIs...\n');

    // Test 1: Get Introduction Requests (requires authentication)
    console.log('1. Testing GET /api/v1/introductions/received');
    try {
        const response = await fetch(`${BASE_URL}/api/v1/introductions/received`, {
            headers: {
                'Content-Type': 'application/json',
                // Note: This will fail without proper Clerk authentication
            }
        });
        
        console.log(`Status: ${response.status}`);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.log('Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Accept Introduction Request (requires authentication and valid ID)
    console.log('2. Testing POST /api/v1/introductions/[id]/accept');
    try {
        const response = await fetch(`${BASE_URL}/api/v1/introductions/test-id/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'I am interested in this opportunity!'
            })
        });
        
        console.log(`Status: ${response.status}`);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.log('Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Decline Introduction Request (requires authentication and valid ID)
    console.log('3. Testing POST /api/v1/introductions/[id]/decline');
    try {
        const response = await fetch(`${BASE_URL}/api/v1/introductions/test-id/decline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Thank you, but this is not a good fit for me right now.'
            })
        });
        
        console.log(`Status: ${response.status}`);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.log('Error:', error.message);
    }
}

// Run tests
testAPIs().catch(console.error);

console.log(`
📋 Test Results Expected:
- All requests should return 401 (Unauthorized) without proper Clerk authentication
- This confirms the APIs are properly protected
- To test with real data, you need to:
  1. Start the dev server: npm run dev
  2. Login as a professional user
  3. Use browser dev tools to test with proper cookies/headers
  4. Or create some test data in the database first

🔧 Next Steps:
1. Create test data in database
2. Test with authenticated requests
3. Verify response formats match expectations
`);

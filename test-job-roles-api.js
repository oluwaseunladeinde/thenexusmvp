// Simple test script to verify job roles API endpoints
// Run with: node test-job-roles-api.js

const BASE_URL = 'http://localhost:3000/api/v1';

// Test data
const testJobRole = {
  roleTitle: 'Senior Software Engineer',
  roleDescription: 'We are looking for a senior software engineer to join our team.',
  requirements: 'Bachelor\'s degree in Computer Science, 5+ years experience',
  seniorityLevel: 'DIRECTOR',
  industry: 'Technology',
  locationCity: 'Lagos',
  locationState: 'Lagos',
  salaryRangeMin: 5000000,
  salaryRangeMax: 8000000,
  requiredSkills: ['JavaScript', 'React', 'Node.js'],
  preferredSkills: ['TypeScript', 'AWS']
};

async function testAPI() {
  console.log('🧪 Testing Job Roles API...\n');

  try {
    // Test 1: GET /job-roles (should require auth)
    console.log('1. Testing GET /job-roles (without auth)...');
    const getResponse = await fetch(`${BASE_URL}/job-roles`);
    console.log(`   Status: ${getResponse.status} (Expected: 401 Unauthorized)`);
    
    if (getResponse.status === 401) {
      console.log('   ✅ Authentication check working\n');
    } else {
      console.log('   ❌ Authentication check failed\n');
    }

    // Test 2: POST /job-roles (should require auth)
    console.log('2. Testing POST /job-roles (without auth)...');
    const postResponse = await fetch(`${BASE_URL}/job-roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testJobRole)
    });
    console.log(`   Status: ${postResponse.status} (Expected: 401 Unauthorized)`);
    
    if (postResponse.status === 401) {
      console.log('   ✅ Authentication check working\n');
    } else {
      console.log('   ❌ Authentication check failed\n');
    }

    console.log('🎉 Basic API structure tests completed!');
    console.log('📝 Note: Full functionality requires authentication via Clerk');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAPI();

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testLogin(nim, username, expectedRole) {
  console.log(`\n🧪 Testing login for ${username}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nim, username })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✓ Login successful for ${username}`);
      console.log(`  Redirect: ${data.redirect}`);
      console.log(`  Expected role: ${expectedRole}`);
      return true;
    } else {
      console.log(`✗ Login failed: ${data.message}`);
      return false;
    }
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Login Tests...\n');
  
  await testLogin('24011150511', 'admin', 'admin');
  await testLogin('24011150512', 'muhammadnur', 'user');
  await testLogin('24011150513', 'budisantoso', 'user');
  
  await testLogin('99999999999', 'invalid', 'none');
  
  console.log('\n✅ All tests completed!');
  process.exit(0);
}

runTests();

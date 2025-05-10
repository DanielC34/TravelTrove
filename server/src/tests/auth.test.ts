import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

async function testRegistration() {
  console.log('\n🧪 Testing Registration...');
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (response.ok) {
      console.log('✅ Registration test passed');
      return data.token;
    } else {
      console.log('❌ Registration test failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Registration test error:', error);
    return null;
  }
}

async function testLogin() {
  console.log('\n🧪 Testing Login...');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (response.ok) {
      console.log('✅ Login test passed');
      return data.token;
    } else {
      console.log('❌ Login test failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Login test error:', error);
    return null;
  }
}

async function testInvalidLogin() {
  console.log('\n🧪 Testing Invalid Login...');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (!response.ok) {
      console.log('✅ Invalid login test passed');
    } else {
      console.log('❌ Invalid login test failed');
    }
  } catch (error) {
    console.error('❌ Invalid login test error:', error);
  }
}

async function runTests() {
  console.log('🚀 Starting authentication tests...\n');

  // Test registration
  const registrationToken = await testRegistration();
  if (!registrationToken) {
    console.log('⚠️ Skipping remaining tests due to registration failure');
    return;
  }

  // Test login
  const loginToken = await testLogin();
  if (!loginToken) {
    console.log('⚠️ Login test failed');
  }

  // Test invalid login
  await testInvalidLogin();

  console.log('\n✨ All tests completed!');
}

// Run the tests
runTests().catch(console.error); 
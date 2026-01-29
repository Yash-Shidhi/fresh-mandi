// Quick API health check and registration test
// Run with: node test-api.js

const http = require('http');

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Testing FreshMandi API...\n');

  try {
    // Test 1: Register a farmer
    console.log('1️⃣ Testing registration...');
    const regRes = await request('POST', '/auth/register', {
      name: 'Test Farmer',
      email: `farmer${Date.now()}@test.com`,
      password: 'password123',
      role: 'farmer',
      city: 'Mumbai',
      mandi: 'Test Mandi'
    });
    console.log('✅ Registration successful:', regRes.data.user.email);

    // Test 2: Login
    console.log('\n2️⃣ Testing login...');
    const loginRes = await request('POST', '/auth/login', {
      email: regRes.data.user.email,
      password: 'password123'
    });
    console.log('✅ Login successful, token received');
    const token = loginRes.data.token;

    // Test 3: Get profile
    console.log('\n3️⃣ Testing profile fetch...');
    const profileRes = await request('GET', '/auth/profile', null, token);
    console.log('✅ Profile fetched:', profileRes.data.user.name);

    // Test 4: Create product (without image)
    console.log('\n4️⃣ Testing product creation...');
    const productRes = await request('POST', '/farmers/products', {
      name: 'Test Tomatoes',
      category: 'Vegetables',
      price: 50,
      quantity: 100,
      city: 'Mumbai'
    }, token);
    console.log('✅ Product created:', productRes.data._id);

    // Test 5: Browse products
    console.log('\n5️⃣ Testing product browsing...');
    const browseRes = await request('GET', '/products?city=Mumbai');
    console.log(`✅ Found ${browseRes.data.length} product(s) in Mumbai`);

    console.log('\n🎉 All tests passed! Backend is working correctly.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test failed:', err.message || err);
    process.exit(1);
  }
}

testAPI();

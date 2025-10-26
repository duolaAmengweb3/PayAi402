#!/usr/bin/env node

const http = require('http');

console.log('\n=== PayAI402 API 自动化测试 ===\n');

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log(`运行 ${tests.length} 个测试...\n`);

  for (const { name, fn } of tests) {
    process.stdout.write(`[测试] ${name}... `);
    try {
      await fn();
      console.log('✅ 通过');
      passed++;
    } catch (error) {
      console.log(`❌ 失败: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n=== 测试完成 ===`);
  console.log(`通过: ${passed}/${tests.length}`);
  console.log(`失败: ${failed}/${tests.length}`);

  if (failed > 0) {
    process.exit(1);
  }
}

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({ status: res.statusCode, data: json, headers: res.headers });
          } catch {
            resolve({ status: res.statusCode, data, headers: res.headers });
          }
        });
      }
    );

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test 1: 402 Payment Required
test('API 应返回 402 Payment Required', async () => {
  const res = await makeRequest('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { model: 'sd-turbo', prompt: 'test' },
  });

  if (res.status !== 402) {
    throw new Error(`期望状态码 402, 得到 ${res.status}`);
  }

  if (!res.data.accepts || !Array.isArray(res.data.accepts)) {
    throw new Error('响应缺少 accepts 数组');
  }
});

// Test 2: Payment Info Structure
test('支付信息结构应正确', async () => {
  const res = await makeRequest('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { model: 'sd-turbo', prompt: 'test' },
  });

  const payment = res.data.accepts[0];
  const requiredFields = ['chain', 'token', 'recipient', 'amount', 'nonce', 'expires'];

  for (const field of requiredFields) {
    if (!(field in payment)) {
      throw new Error(`支付信息缺少字段: ${field}`);
    }
  }

  if (payment.chain !== 'base') {
    throw new Error(`期望 chain=base, 得到 ${payment.chain}`);
  }

  if (payment.token !== 'USDC') {
    throw new Error(`期望 token=USDC, 得到 ${payment.token}`);
  }
});

// Test 3: Recipient Address Format
test('收款地址格式应正确', async () => {
  const res = await makeRequest('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { model: 'sd-turbo', prompt: 'test' },
  });

  const recipient = res.data.accepts[0].recipient;
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;

  if (!addressRegex.test(recipient)) {
    throw new Error(`收款地址格式错误: ${recipient}`);
  }
});

// Test 4: Nonce Uniqueness
test('Nonce 应保持唯一性', async () => {
  const nonces = new Set();

  for (let i = 0; i < 5; i++) {
    const res = await makeRequest('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { model: 'sd-turbo', prompt: 'test' },
    });

    const nonce = res.data.accepts[0].nonce;
    if (nonces.has(nonce)) {
      throw new Error(`Nonce 重复: ${nonce}`);
    }
    nonces.add(nonce);
  }
});

// Test 5: Expiry Time
test('过期时间应合理', async () => {
  const res = await makeRequest('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { model: 'sd-turbo', prompt: 'test' },
  });

  const expires = res.data.accepts[0].expires;
  const now = Math.floor(Date.now() / 1000);
  const diff = expires - now;

  // Should expire in 4-6 minutes
  if (diff < 240 || diff > 360) {
    throw new Error(`过期时间不合理: ${diff} 秒`);
  }
});

// Test 6: Invalid Payment Header
test('无效支付凭证应被拒绝', async () => {
  const res = await makeRequest('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-PAYMENT': JSON.stringify({
        chain: 'base',
        token: 'USDC',
        tx: '0xinvalidtxhash',
        nonce: 'invalid',
      }),
    },
    body: { model: 'sd-turbo', prompt: 'test' },
  });

  // Should return 400 or 402 (depending on validation logic)
  if (res.status !== 400 && res.status !== 402) {
    throw new Error(`期望状态码 400 或 402, 得到 ${res.status}`);
  }
});

// Run all tests
runTests().catch((error) => {
  console.error('测试运行失败:', error);
  process.exit(1);
});

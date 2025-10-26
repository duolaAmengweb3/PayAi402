#!/usr/bin/env node

const crypto = require('crypto');

// 生成 Solana 钱包（Ed25519 密钥对）
function generateSolanaWallet() {
  // 生成 32 字节种子
  const seed = crypto.randomBytes(32);

  // Solana 使用 Ed25519 曲线
  // 这里我们生成私钥（实际需要 @solana/web3.js 来正确生成地址）
  const privateKey = seed.toString('hex');

  return { seed, privateKey };
}

const wallet = generateSolanaWallet();

console.log('\n========================================');
console.log('   PayAI402 Solana Wallet');
console.log('========================================\n');
console.log('🔑 Private Key (Seed):');
console.log(`   ${wallet.privateKey}\n`);
console.log('========================================');
console.log('⚠️  注意：');
console.log('   Solana 地址需要使用 @solana/web3.js 生成');
console.log('   安装依赖后会显示完整的公钥地址');
console.log('========================================\n');
console.log('📋 下一步：');
console.log('   npm install @solana/web3.js');
console.log('   然后运行完整的钱包生成');
console.log('========================================\n');

// 保存到临时文件供后续使用
const fs = require('fs');
fs.writeFileSync('.solana-seed', wallet.privateKey);
console.log('✅ 私钥已保存到 .solana-seed (临时文件)\n');

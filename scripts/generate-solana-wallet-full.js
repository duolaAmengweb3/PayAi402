#!/usr/bin/env node

const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

// 生成 Solana 钱包
const keypair = Keypair.generate();

const publicKey = keypair.publicKey.toString();
const secretKey = bs58.default.encode(keypair.secretKey);
const secretKeyArray = Array.from(keypair.secretKey);

console.log('\n========================================');
console.log('   PayAI402 Solana Wallet');
console.log('========================================\n');
console.log('📍 Public Key (收款地址):');
console.log(`   ${publicKey}\n`);
console.log('🔑 Secret Key (Base58):');
console.log(`   ${secretKey}\n`);
console.log('🔑 Secret Key (Array - for code):');
console.log(`   [${secretKeyArray.slice(0, 10).join(',')}...]\n`);
console.log('========================================');
console.log('⚠️  安全提醒：');
console.log('   1. 请妥善保管 Secret Key');
console.log('   2. 不要泄露给任何人');
console.log('   3. 不要提交到 Git 仓库');
console.log('========================================\n');
console.log('📋 部署步骤：');
console.log('   1. 将以下变量添加到 .env.local:\n');
console.log(`   SOLANA_RECIPIENT_ADDRESS=${publicKey}`);
console.log(`   SOLANA_SECRET_KEY=${secretKey}\n`);
console.log('   2. 部署到 Vercel 时同样配置');
console.log('========================================\n');
console.log('💰 查看余额：');
console.log(`   https://solscan.io/account/${publicKey}\n`);
console.log('========================================\n');

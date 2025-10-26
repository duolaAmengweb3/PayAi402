#!/bin/bash

# PayAI402 一键部署脚本

set -e

echo "==================================="
echo "  PayAI402 一键部署脚本"
echo "==================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 步骤 1: 检查环境配置
echo "📋 步骤 1/5: 检查环境配置"
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ 未找到 .env.local 文件${NC}"
    echo "   请先运行: cp .env.example .env.local"
    echo "   并填写必要的环境变量"
    exit 1
fi

# 检查必要的环境变量
if ! grep -q "RECIPIENT_ADDRESS" .env.local; then
    echo -e "${RED}❌ 缺少 RECIPIENT_ADDRESS 配置${NC}"
    exit 1
fi

if ! grep -q "PRIVATE_KEY" .env.local; then
    echo -e "${RED}❌ 缺少 PRIVATE_KEY 配置${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 环境配置检查通过${NC}"
echo ""

# 步骤 2: 初始化 Git 仓库
echo "📦 步骤 2/5: 初始化 Git 仓库"
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Git 仓库初始化完成${NC}"
else
    echo -e "${YELLOW}⚠️  Git 仓库已存在${NC}"
fi
echo ""

# 步骤 3: 添加文件并提交
echo "💾 步骤 3/5: 提交代码"
git add .
git commit -m "feat: PayAI402 MVP - x402 AI Content Generator" || echo -e "${YELLOW}⚠️  没有新的更改需要提交${NC}"
echo -e "${GREEN}✅ 代码提交完成${NC}"
echo ""

# 步骤 4: GitHub 配置
echo "🌐 步骤 4/5: 配置 GitHub 远程仓库"
echo ""
echo "请访问 https://github.com/new 创建新仓库"
echo ""
read -p "是否已创建 GitHub 仓库? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "请输入你的 GitHub 用户名: " github_user
    read -p "请输入仓库名称 (默认: payai402): " repo_name
    repo_name=${repo_name:-payai402}

    git remote add origin "https://github.com/$github_user/$repo_name.git" 2>/dev/null || \
    git remote set-url origin "https://github.com/$github_user/$repo_name.git"

    git branch -M main

    echo ""
    echo "正在推送到 GitHub..."
    git push -u origin main

    echo -e "${GREEN}✅ 代码已推送到 GitHub${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  跳过 GitHub 推送${NC}"
    echo "   请手动创建仓库后运行:"
    echo "   git remote add origin <your-repo-url>"
    echo "   git push -u origin main"
    echo ""
fi

# 步骤 5: Vercel 部署指引
echo "🚀 步骤 5/5: 部署到 Vercel"
echo ""
echo "现在请按以下步骤部署到 Vercel:"
echo ""
echo "1. 访问: https://vercel.com"
echo "2. 使用 GitHub 登录"
echo "3. 点击 'Add New Project'"
echo "4. 选择你的 '$repo_name' 仓库"
echo "5. 配置以下环境变量:"
echo ""
echo "   必需变量:"
echo "   --------------------------------------------------"

# 从 .env.local 读取并显示
while IFS='=' read -r key value; do
    # 跳过空行和注释
    if [[ -z "$key" || "$key" =~ ^# ]]; then
        continue
    fi

    # 跳过 NEXT_PUBLIC_ 开头的（这些在 vercel.json 中已配置）
    if [[ "$key" =~ ^NEXT_PUBLIC_ ]]; then
        continue
    fi

    echo "   $key=$value"
done < .env.local

echo "   --------------------------------------------------"
echo ""
echo "6. 点击 'Deploy' 按钮"
echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "==================================="
echo "  下一步操作"
echo "==================================="
echo ""
echo "1. 等待 Vercel 构建完成 (约 2-3 分钟)"
echo "2. 访问你的 Vercel URL"
echo "3. 测试支付流程:"
echo "   - 连接 MetaMask"
echo "   - 切换到 Base 网络"
echo "   - 测试支付 (建议先用测试网)"
echo ""
echo "测试网配置 (Base Sepolia):"
echo "  - NEXT_PUBLIC_CHAIN_ID=84532"
echo "  - NEXT_PUBLIC_RPC_URL=https://sepolia.base.org"
echo "  - NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e"
echo "  - NEXT_PUBLIC_PAYMENT_AMOUNT=0.01"
echo ""
echo "获取测试资产:"
echo "  - Base Sepolia ETH: https://www.coinbase.com/faucets"
echo "  - 测试 USDC: https://faucet.circle.com/"
echo ""
echo "==================================="

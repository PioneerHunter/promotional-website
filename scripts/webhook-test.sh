#!/bin/bash

# Webhook 测试脚本
# 用于测试部署脚本是否正常工作

set -e

echo "=========================================="
echo "测试 Webhook 部署脚本..."
echo "=========================================="

# 项目目录
PROJECT_DIR="/app/promotional-website"
cd "$PROJECT_DIR" || exit 1

# 检查必要文件
echo "1. 检查必要文件..."
if [ ! -f "docker-compose.yml" ]; then
  echo "错误: docker-compose.yml 不存在"
  exit 1
fi

if [ ! -f "Dockerfile" ]; then
  echo "错误: Dockerfile 不存在"
  exit 1
fi

echo "✓ 文件检查通过"

# 检查 Docker
echo "2. 检查 Docker..."
if ! command -v docker &> /dev/null; then
  echo "错误: Docker 未安装"
  exit 1
fi

if ! command -v docker compose &> /dev/null; then
  echo "错误: Docker Compose 未安装"
  exit 1
fi

echo "✓ Docker 检查通过"

# 检查 Git
echo "3. 检查 Git..."
if ! command -v git &> /dev/null; then
  echo "错误: Git 未安装"
  exit 1
fi

echo "✓ Git 检查通过"

echo "=========================================="
echo "所有检查通过！"
echo "=========================================="


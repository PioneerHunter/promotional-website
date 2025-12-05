# 部署日志查看指南

## 日志文件位置

部署脚本的输出会保存到以下位置：

```
/app/promotional-website/logs/
├── deploy-20250103-143022.log  # 带时间戳的日志文件
├── deploy-20250103-150135.log
└── deploy-latest.log          # 最新日志的软链接
```

## 查看日志的方法

### 1. 直接查看日志文件

```bash
# 查看最新日志
cat /app/promotional-website/logs/deploy-latest.log

# 查看特定时间的日志
cat /app/promotional-website/logs/deploy-20250103-143022.log

# 实时查看最新日志（如果部署正在进行）
tail -f /app/promotional-website/logs/deploy-latest.log

# 查看最近的日志（最后 100 行）
tail -n 100 /app/promotional-website/logs/deploy-latest.log
```

### 2. 通过 API 查看日志

#### 获取日志列表

```bash
GET /api/webhook/logs
```

返回：
```json
{
  "success": true,
  "logs": [
    "deploy-20250103-150135.log",
    "deploy-20250103-143022.log"
  ],
  "latest": "deploy-20250103-150135.log"
}
```

#### 获取特定日志内容

```bash
GET /api/webhook/logs?file=deploy-20250103-150135.log
```

返回：
```json
{
  "success": true,
  "file": "deploy-20250103-150135.log",
  "content": "日志内容..."
}
```

### 3. 查看 Next.js 应用日志

如果通过 PM2 运行：

```bash
# 查看 PM2 日志
pm2 logs promotional-website

# 查看错误日志
pm2 logs promotional-website --err

# 查看最近的日志
pm2 logs promotional-website --lines 100
```

如果通过 Docker 运行：

```bash
# 查看容器日志
docker compose logs frontend

# 实时查看日志
docker compose logs -f frontend

# 查看最近的日志
docker compose logs --tail=100 frontend
```

### 4. 查看系统日志

如果使用 systemd：

```bash
# 查看服务日志
journalctl -u your-service-name -f

# 查看最近的日志
journalctl -u your-service-name -n 100
```

## 日志内容说明

部署日志包含以下信息：

1. **开始时间** - 部署开始的时间戳
2. **日志文件路径** - 当前日志文件的完整路径
3. **Git 操作** - 拉取最新代码的过程
4. **Docker 操作** - 停止、构建、启动容器的过程
5. **容器状态** - 部署后的容器运行状态
6. **完成时间** - 部署完成的时间戳

## 日志轮转

建议定期清理旧日志，避免占用过多磁盘空间：

```bash
# 删除 7 天前的日志
find /app/promotional-website/logs -name "deploy-*.log" -mtime +7 -delete

# 或保留最近 10 个日志文件
cd /app/promotional-website/logs
ls -t deploy-*.log | tail -n +11 | xargs rm -f
```

可以添加到 crontab：

```bash
# 每天凌晨清理 7 天前的日志
0 0 * * * find /app/promotional-website/logs -name "deploy-*.log" -mtime +7 -delete
```

## 故障排查

### 日志文件不存在

1. 检查日志目录权限：
   ```bash
   ls -la /app/promotional-website/logs
   ```

2. 检查脚本执行权限：
   ```bash
   ls -l /app/promotional-website/scripts/deploy.sh
   ```

3. 手动执行脚本测试：
   ```bash
   bash /app/promotional-website/scripts/deploy.sh
   ```

### 日志内容为空

1. 检查脚本是否正确执行
2. 检查文件系统权限
3. 查看系统日志确认是否有错误

### 无法访问日志 API

1. 检查 API 路由是否正确
2. 检查文件系统权限
3. 查看 Next.js 应用日志


# 跨平台开发指南

本项目支持 Mac 和 Windows 协同开发。为了确保代码在不同操作系统上的一致性，项目已配置了以下跨平台兼容性设置。

## 配置文件说明

### 1. `.editorconfig`
统一编辑器配置，确保所有开发者使用相同的代码格式：
- **换行符**: 统一使用 LF（Unix 风格）
- **缩进**: 使用空格，2 个空格
- **字符集**: UTF-8
- **去除行尾空格**: 自动删除
- **文件末尾换行**: 自动添加

### 2. `.gitattributes`
确保 Git 正确处理换行符：
- **文本文件**: 自动检测并统一使用 LF
- **源代码文件**: 强制使用 LF（.ts, .tsx, .js, .jsx 等）
- **二进制文件**: 正确标记为二进制（图片、字体等）
- **OS 文件**: 忽略系统生成的文件（.DS_Store, Thumbs.db 等）

### 3. `package.json` 脚本
使用 `cross-env` 确保环境变量在 Windows 和 Mac 上都能正常工作：
- `pm2:prod`: 使用 `cross-env` 设置环境变量

## 开发建议

### 编辑器设置
1. **安装 EditorConfig 插件**（VS Code、WebStorm 等都有）
2. 确保编辑器使用 UTF-8 编码
3. 显示空白字符，便于发现空格/制表符混用

### Git 配置
建议在本地 Git 配置中设置：
```bash
# 自动转换换行符（推荐）
git config --global core.autocrlf input  # Mac/Linux
git config --global core.autocrlf true   # Windows

# 或者禁用自动转换，完全依赖 .gitattributes
git config --global core.autocrlf false
```

### 常见问题

#### 1. 换行符不一致
**问题**: 文件在不同系统上显示换行符不同
**解决**: 
- 确保 `.gitattributes` 已提交到仓库
- 运行 `git add --renormalize .` 重新规范化文件

#### 2. 脚本在 Windows 上不工作
**问题**: `PM2_ENV=production` 在 Windows CMD 中不工作
**解决**: 已使用 `cross-env` 包，确保跨平台兼容

#### 3. 路径分隔符问题
**问题**: Windows 使用 `\`，Mac/Linux 使用 `/`
**解决**: 
- 代码中使用 `path.join()` 或 `path.resolve()`（Node.js）
- 使用 `/` 在代码中（Node.js 会自动转换）

#### 4. 文件权限问题
**问题**: Mac/Linux 有文件执行权限，Windows 没有
**解决**: 
- 脚本文件使用 `chmod +x`（Mac/Linux）
- Git 会自动处理 `.sh` 文件的执行权限

## 验证配置

### 检查换行符
```bash
# Mac/Linux
file -k filename

# 或使用 Git
git ls-files --eol
```

### 检查 EditorConfig
确保编辑器已安装 EditorConfig 插件，打开文件时应该自动应用配置。

### 测试脚本
```bash
# 测试跨平台脚本
pnpm run pm2:prod
```

## 最佳实践

1. **提交前检查**: 使用 `git diff` 检查是否有意外的换行符变化
2. **使用 EditorConfig**: 让编辑器自动处理格式
3. **统一包管理器**: 使用 `pnpm`（已在 package.json 中指定）
4. **代码审查**: 注意检查换行符和缩进的一致性
5. **CI/CD**: 在 CI 中运行 lint 检查，确保代码格式一致

## 相关资源

- [EditorConfig 官网](https://editorconfig.org/)
- [Git Attributes 文档](https://git-scm.com/docs/gitattributes)
- [cross-env 文档](https://github.com/kentcdodds/cross-env)


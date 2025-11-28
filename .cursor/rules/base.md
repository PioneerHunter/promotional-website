# 推广网站项目规则

## 项目概述
这是一个个人宣传+产品展示的类博客网站，基于 Next.js 16，使用的技术栈包括：
- **框架**: Next.js 16.0.5 (App Router)
- **语言**: TypeScript 5
- **UI 库**: React 19.2.0
- **样式**: Tailwind CSS v4
- **包管理器**: pnpm 9.15.0
- **代码检查**: ESLint (eslint-config-next)

## 代码风格与最佳实践

### TypeScript
- 使用严格的 TypeScript 配置
- 始终为函数参数和返回值定义明确的类型
- 在适当的地方使用 `Readonly<>` 修饰 props 接口
- 简单情况优先使用类型推断，复杂类型需要显式声明
- 对象形状使用 `type`，可扩展的契约使用 `interface`

### React 与 Next.js
- 默认使用 Server Components（除非需要，否则不使用 'use client'）
- 仅在需要使用 hooks、事件处理器或浏览器 API 时添加 'use client' 指令
- Server Components 获取数据时使用 async/await
- 优先使用 Next.js Image 组件而非普通 img 标签
- 内部导航使用 Next.js Link 组件
- 页面组件和布局使用默认导出
- 工具函数和组件使用命名导出

### 文件组织
- 遵循 Next.js App Router 约定：
  - `app/` 目录用于路由和布局
  - `app/layout.tsx` 为根布局
  - `app/page.tsx` 为首页
  - 使用路由组 `(folder)` 进行组织，不影响 URL
- 将组件放在合适的目录中（逻辑相关时采用就近原则）
- 所有新文件使用 TypeScript (.ts, .tsx)

### Tailwind CSS v4 样式
- 使用 Tailwind 工具类进行样式设计
- 利用 `globals.css` 中定义的 CSS 变量进行主题化
- 使用 `dark:` 前缀支持暗色模式
- 使用响应式断点：`sm:`, `md:`, `lg:`, `xl:`
- 优先使用语义化颜色令牌（如 `bg-background`, `text-foreground`）
- 自定义主题值使用 `@theme inline`
- 保持自定义 CSS 最小化，优先使用 Tailwind 工具类

### 组件模式
- 使用 TypeScript 函数式组件
- 保持组件专注和单一职责
- 在适当时将可复用逻辑提取到自定义 hooks
- 使用正确的语义化 HTML 元素
- 确保可访问性：正确的 alt 文本、ARIA 标签、键盘导航

### 性能优化
- 使用 Next.js Image 组件，设置正确的 width、height 和 priority 属性
- 实现适当的加载状态和错误边界
- 对大型组件使用动态导入以优化打包体积
- 使用 Server Components 减少客户端 JavaScript

### 代码质量
- 提交前运行 ESLint
- 遵循 Next.js 和 React 最佳实践
- 编写自文档化代码，使用清晰的变量和函数名
- 仅在需要解释"为什么"时添加注释，而非解释"是什么"
- 保持函数小而专注

### Git 与版本控制
- 使用有意义的提交信息
- 保持提交原子化和专注
- 不要提交 node_modules、.next 或构建产物

## 具体指南

### 导入
- 配置了 `@/*` 别名时使用绝对导入
- 分组导入：先外部库，后内部模块
- 仅类型导入使用：`import type { ... }`

### 元数据与 SEO
- 在 layout.tsx 或 page.tsx 中使用 Next.js Metadata API 定义元数据
- 为推广内容包含适当的 title、description 和 Open Graph 标签

### 字体
- 使用 Next.js 字体优化 (next/font/google)
- 通过 className 应用字体变量（如 `${geistSans.variable}`）

### 暗色模式
- 使用 `prefers-color-scheme` 媒体查询支持系统偏好
- 使用 CSS 变量进行主题颜色管理
- 测试亮色和暗色两种模式

## 添加新功能时
1. 检查是否存在类似功能以保持一致性
2. 遵循现有模式和约定
3. 确保响应式设计在移动端、平板和桌面端正常工作
4. 测试暗色模式兼容性
5. 验证 TypeScript 类型正确
6. 完成前运行代码检查

## 常用模式

### 页面组件
```typescript
export default function PageName() {
  return (
    <div className="...">
      {/* 内容 */}
    </div>
  );
}
```

### 布局组件
```typescript
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="...">
      {children}
    </div>
  );
}
```

### 客户端组件
```typescript
'use client';

export default function ClientComponent() {
  // hooks、事件处理器等
}
```

## 避免事项
- 使用 `any` 类型（如果类型确实未知，使用 `unknown`）
- 错误混合 Server 和 Client Component 模式
- 内联样式（使用 Tailwind 类代替）
- 不必要的重新渲染（需要时使用 React.memo、useMemo、useCallback）
- 硬编码应该可配置的值
- 忽略可访问性要求


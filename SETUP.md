# Ylicen 全栈项目指南

## 项目概览

这是一个完整的全栈项目，包含前端和后端两部分：

- **前端**：Vue 3 + TypeScript + Vite，部署在 GitHub Pages
- **后端**：Hono + Cloudflare Workers，部署在 Cloudflare
- **域名**：ylicen.top （已在 Cloudflare 配置）

## 快速开始

### 前端开发

```bash
cd frontend
npm run dev
```

访问 `http://localhost:5173` 查看前端应用

### 后端开发

```bash
cd backend
npm install -g wrangler  # 首次需要全局安装
npm run dev
```

访问 `http://localhost:8787` 测试后端 API

## 前后端通信

### 配置 API 基础 URL

在前端中，创建 `frontend/src/api/client.ts`：

```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.ylicen.top'
  : 'http://localhost:8787';

export const apiClient = {
  async get(path: string) {
    const response = await fetch(`${API_BASE_URL}${path}`);
    return response.json();
  },
  
  async post(path: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};
```

### 在组件中使用

```typescript
import { apiClient } from '@/api/client';

// 调用后端 API
const response = await apiClient.get('/api/health');
```

## 部署流程

### 前端部署（GitHub Pages）

```bash
cd frontend
npm run build
# dist 目录会自动通过 GitHub Actions 部署到 yl.ylicen.top
```

### 后端部署（Cloudflare Workers）

#### 1. 准备 Cloudflare 账户

- 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
- 在 Account Settings > API Tokens 中创建 API Token
- 记录 Account ID 和 API Token

#### 2. 配置 wrangler

编辑 `backend/wrangler.toml`：

```toml
[env.production]
route = "api.ylicen.top/api/*"
zone_id = "your-zone-id"  # 从 Cloudflare 获取
```

#### 3. 部署

```bash
cd backend
wrangler login  # 使用 API Token 登录
npm run deploy
```

## 环境变量

### 前端环境变量

在 `frontend/.env.production` 中配置：

```
VITE_API_URL=https://api.ylicen.top
```

### 后端环境变量

在 `backend/wrangler.toml` 中配置：

```toml
[env.production]
vars = { ENVIRONMENT = "production" }
```

## 目录结构

```
ylicen.github.io/
├── frontend/          # Vue 3 前端项目
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Hono 后端项目
│   ├── src/
│   │   └── index.ts   # 主应用程序
│   ├── package.json
│   ├── wrangler.toml
│   └── tsconfig.json
└── README.md
```

## 常见任务

### 添加新的后端 API 端点

在 `backend/src/index.ts` 中添加：

```typescript
// 获取用户列表
app.get('/api/users', (c) => {
  return c.json([
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' }
  ]);
});

// 创建新用户
app.post('/api/users', async (c) => {
  const body = await c.req.json();
  // 处理逻辑...
  return c.json({ id: 3, ...body }, { status: 201 });
});
```

### 添加数据库连接

推荐选项：

1. **Cloudflare D1**（SQLite）- 与 Workers 无缝集成
   ```typescript
   export interface Env {
     DB: D1Database;
   }
   
   app.get('/api/data', async (c) => {
     const { results } = await c.env.DB.prepare('SELECT * FROM table').all();
     return c.json(results);
   });
   ```

2. **Supabase** - PostgreSQL + 实时功能
3. **MongoDB Atlas** - NoSQL 选项

## 测试

### 前端测试

```bash
cd frontend
npm run test  # 运行单元测试
```

### 后端测试

```bash
cd backend
# 使用 Postman 或 curl 测试
curl http://localhost:8787/api/health
```

## 故障排除

### 前后端通信错误

检查 CORS 配置。在 `backend/src/index.ts` 中添加：

```typescript
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://yl.ylicen.top'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type']
}));
```

需要安装 `@hono/cors`：

```bash
cd backend
npm install @hono/cors
```

## 更多资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Hono 官方文档](https://hono.dev/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 数据库](https://developers.cloudflare.com/d1/)

---

项目维护：Ylicen

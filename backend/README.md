# Ylicen Backend

使用 **Hono** 框架在 **Cloudflare Workers** 上运行的后端 API 服务。

## 快速开始

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

会通过 Wrangler 启动本地开发服务器，默认地址 `http://localhost:8787`

### 部署到 Cloudflare Workers
```bash
npm run deploy
```

## API 端点示例

- `GET /api/health` - 健康检查
- `GET /api/hello/:name` - 参数示例
- `POST /api/echo` - 请求体回显

## 配置

编辑 `wrangler.toml` 配置 Cloudflare Workers 部署参数：
- 环境变量
- 路由规则
- KV 绑定等

## 文件结构

```
backend/
├── src/
│   └── index.ts       # 主应用程序
├── package.json       # 项目依赖
├── wrangler.toml      # Cloudflare Workers 配置
├── tsconfig.json      # TypeScript 配置
└── README.md          # 本文档
```

## 为什么选择 Hono？

- ✅ 专为边缘计算（Workers、Deno、Bun）优化
- ✅ 超轻量级，零冷启动
- ✅ 完整的路由、中间件、验证支持
- ✅ TypeScript 原生支持
- ✅ 官方文档详尽，社区活跃

更多信息：https://hono.dev

import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// 启用 CORS 支持前后端通信
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://yl.ylicen.top'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-JSON-Response-Size'],
  maxAge: 600,
  credentials: true
}));

// 健康检查
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 示例 API
app.get('/api/hello/:name', (c) => {
  const name = c.req.param('name');
  return c.json({ message: `Hello, ${name}!` });
});

// POST 示例
app.post('/api/echo', async (c) => {
  const body = await c.req.json();
  return c.json({ echo: body });
});

export default app;

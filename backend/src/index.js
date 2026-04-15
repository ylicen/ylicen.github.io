import { Hono } from 'hono';
const app = new Hono();
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
//# sourceMappingURL=index.js.map
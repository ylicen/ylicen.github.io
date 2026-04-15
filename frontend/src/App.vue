<script setup lang="ts">
import { useHealthCheck } from '@/composables/useApi';
import { apiClient } from '@/api/client';
import { ref } from 'vue';

// 检查后端健康状态
const { data: healthData, loading: healthLoading, error: healthError } = useHealthCheck();

// 测试 API 响应
const testName = ref('Ylicen');
const testResponse = ref<any>(null);
const testLoading = ref(false);
const testError = ref<string>('');

const testApi = async () => {
  testLoading.value = true;
  testError.value = '';
  
  try {
    const response = await apiClient.get(`/api/hello/${testName.value}`);
    testResponse.value = response;
  } catch (err) {
    testError.value = err instanceof Error ? err.message : String(err);
  } finally {
    testLoading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <h1>🚀 Ylicen 全栈项目</h1>
    
    <section>
      <h2>后端健康检查</h2>
      <div v-if="healthLoading" class="status loading">检查中...</div>
      <div v-else-if="healthError" class="status error">❌ 连接失败</div>
      <div v-else-if="healthData" class="status success">
        ✅ 后端正常运行
        <pre>{{ JSON.stringify(healthData, null, 2) }}</pre>
      </div>
    </section>

    <section>
      <h2>测试 API 调用</h2>
      <div class="test-form">
        <input 
          v-model="testName" 
          type="text" 
          placeholder="输入名字"
          @keyup.enter="testApi"
        />
        <button @click="testApi" :disabled="testLoading">
          {{ testLoading ? '加载中...' : '调用 API' }}
        </button>
      </div>

      <div v-if="testError" class="status error">
        ❌ 错误: {{ testError }}
      </div>
      <div v-else-if="testResponse" class="status success">
        ✅ API 响应:
        <pre>{{ JSON.stringify(testResponse, null, 2) }}</pre>
      </div>
    </section>

    <section class="links">
      <h3>文档与资源</h3>
      <ul>
        <li><a href="https://vuejs.org/" target="_blank">Vue 3 文档</a></li>
        <li><a href="https://hono.dev/" target="_blank">Hono 文档</a></li>
        <li><a href="https://developers.cloudflare.com/workers/" target="_blank">Cloudflare Workers</a></li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  border-bottom: 3px solid #42b983;
  padding-bottom: 0.5rem;
}

h2 {
  color: #555;
  margin: 2rem 0 1rem;
  font-size: 1.3rem;
}

h3 {
  color: #666;
  margin-top: 1rem;
}

section {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #e0e0e0;
}

.status {
  padding: 1rem;
  border-radius: 4px;
  font-weight: 500;
  margin: 1rem 0;
}

.status.loading {
  background: #e3f2fd;
  color: #1976d2;
}

.status.success {
  background: #e8f5e9;
  color: #388e3c;
}

.status.error {
  background: #ffebee;
  color: #c62828;
}

pre {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  border: 1px solid #ddd;
}

.test-form {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

button {
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #359268;
}

button:disabled {
  background: #999;
  cursor: not-allowed;
}

.links {
  background: #fff9e6;
  border-color: #ffd686;
}

.links ul {
  list-style: none;
  margin-top: 1rem;
}

.links li {
  margin: 0.5rem 0;
}

.links a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.links a:hover {
  text-decoration: underline;
}
</style>

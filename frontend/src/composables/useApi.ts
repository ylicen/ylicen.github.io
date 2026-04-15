import { ref, computed } from 'vue';
import { apiClient } from '@/api/client';

export interface UseApiOptions {
  immediate?: boolean;
  onError?: (error: Error) => void;
}

/**
 * 用于处理 API 请求的 Vue 3 组合函数
 * @param fetcher 异步获取函数
 * @param options 配置选项
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = false, onError } = options;

  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetch = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      data.value = await fetcher();
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      onError?.(error.value);
    } finally {
      loading.value = false;
    }
  };

  const isLoading = computed(() => loading.value);
  const isError = computed(() => error.value !== null);
  const isSuccess = computed(() => data.value !== null && !error.value);

  if (immediate) {
    fetch();
  }

  return {
    data,
    loading: isLoading,
    error,
    fetch,
    isLoading,
    isError,
    isSuccess,
  };
}

/**
 * 检查后端健康状态
 */
export function useHealthCheck() {
  return useApi(
    () => apiClient.get('/api/health'),
    { immediate: true }
  );
}

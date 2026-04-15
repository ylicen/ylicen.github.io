<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

type PlatformKey = "windows" | "macos" | "linux"

interface UpdateManifest {
  version?: string
  dateLabel?: string
  downloadUrl?: string
  downloads?: Partial<Record<PlatformKey, string>>
}

const DEFAULT_R2_MANIFEST_URL = "https://dl.ylicen.top/latest.json"
const R2_MANIFEST_URL = import.meta.env.VITE_R2_MANIFEST_URL ?? DEFAULT_R2_MANIFEST_URL

const resolveDefaultHost = () => {
  try {
    return new URL(R2_MANIFEST_URL).hostname
  } catch {
    return "dl.ylicen.top"
  }
}

const R2_DOWNLOAD_HOST = import.meta.env.VITE_R2_DOWNLOAD_HOST ?? resolveDefaultHost()

const platformList: Array<{ key: PlatformKey; label: string }> = [
  { key: "windows", label: "Windows" },
  { key: "macos", label: "macOS" },
  { key: "linux", label: "Linux" },
]

const manifest = ref<UpdateManifest | null>(null)
const loading = ref(true)
const errorMessage = ref("")

const isR2Link = (value?: string) => {
  if (!value) return false

  try {
    const parsed = new URL(value)
    return parsed.hostname === R2_DOWNLOAD_HOST || parsed.hostname.endsWith(`.${R2_DOWNLOAD_HOST}`)
  } catch {
    return false
  }
}

const resolvePlatformLink = (platform: PlatformKey) => {
  if (!manifest.value) return ""

  const directLink = manifest.value.downloads?.[platform]
  if (isR2Link(directLink)) return directLink ?? ""

  if (platform === "windows" && isR2Link(manifest.value.downloadUrl)) {
    return manifest.value.downloadUrl ?? ""
  }

  return ""
}

const releaseVersion = computed(() => manifest.value?.version ?? "")
const hasAnyDownload = computed(() => platformList.some(({ key }) => !!resolvePlatformLink(key)))

onMounted(async () => {
  try {
    const response = await fetch(R2_MANIFEST_URL, { cache: "no-store" })
    if (!response.ok) {
      throw new Error(`R2 manifest request failed: ${response.status}`)
    }

    const data = (await response.json()) as UpdateManifest
    manifest.value = data

    if (!hasAnyDownload.value) {
      errorMessage.value = "R2 清单已读取，但尚未提供可用平台安装包。"
    }
  } catch {
    errorMessage.value = "当前无法读取 R2 下载清单，请稍后重试。"
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section id="download" class="py-20 lg:py-24 bg-zinc-50 border-y border-zinc-200/70 scroll-mt-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center">
        <p class="text-xs font-semibold tracking-wider uppercase text-zinc-600">Download</p>
        <h2 class="mt-3 text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-zinc-900">
          下载 LuminaDB
        </h2>
        <p class="mt-4 text-base sm:text-lg text-zinc-700 leading-relaxed">
          仅提供 R2 下载源。发布流程会先从 GitHub 更新仓库获取最新安装包，再同步到 R2 对外分发。
        </p>
        <p v-if="releaseVersion" class="mt-3 text-sm text-zinc-600">
          当前发布版本：{{ releaseVersion }}
        </p>
      </div>

      <p v-if="loading" class="mt-10 text-center text-sm text-zinc-600">正在读取 R2 最新下载信息...</p>
      <p v-else-if="errorMessage" class="mt-10 text-center text-sm text-zinc-600">{{ errorMessage }}</p>

      <div v-if="!loading" class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div
          v-for="platform in platformList"
          :key="platform.key"
          class="rounded-2xl border border-zinc-200 bg-white px-5 py-6 text-center shadow-sm"
        >
          <p class="text-sm text-zinc-600">{{ platform.label }}</p>

          <a
            v-if="resolvePlatformLink(platform.key)"
            :href="resolvePlatformLink(platform.key)"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex items-center justify-center rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            从 R2 下载
          </a>

          <p v-else class="mt-2 text-zinc-900 font-semibold">暂未发布</p>
        </div>
      </div>

      <p v-if="!loading && !hasAnyDownload" class="mt-6 text-center text-xs text-zinc-500">
        如果你已在 GitHub Releases 发布新版本，请先将安装包同步到 R2，再更新 `latest.json` 的下载地址。
      </p>
    </div>
  </section>
</template>
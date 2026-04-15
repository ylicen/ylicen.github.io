<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useReleaseManifest } from "../composables/useReleaseManifest"
import type { PlatformKey } from "../composables/useReleaseManifest"

const FALLBACK_DOWNLOAD_HOSTS = [
  "dl.ylicen.top",
  "pub-1745b19bd2c3417582bf63e8b26caab0.r2.dev",
]

const resolveDefaultHost = () => {
  try {
    return new URL(manifestUrl).hostname
  } catch {
    return "dl.ylicen.top"
  }
}

const { manifest, loading, error, manifestUrl, normalizedVersion, loadManifest } = useReleaseManifest()

const R2_DOWNLOAD_HOST = import.meta.env.VITE_R2_DOWNLOAD_HOST ?? resolveDefaultHost()

const ALLOWED_DOWNLOAD_HOSTS = Array.from(
  new Set([R2_DOWNLOAD_HOST, ...FALLBACK_DOWNLOAD_HOSTS]),
)

const isR2Link = (value?: string) => {
  if (!value) return false

  try {
    const parsed = new URL(value)
    if (parsed.protocol !== "https:") return false

    return ALLOWED_DOWNLOAD_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`),
    )
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

const windowsDownloadLink = computed(() => resolvePlatformLink("windows"))
const hasWindowsDownload = computed(() => !!windowsDownloadLink.value)
const sectionMessage = computed(() => {
  if (error.value) return error.value
  if (!loading.value && !hasWindowsDownload.value) {
    return "R2 清单已读取，但当前仅支持 Windows 且安装包暂不可用。"
  }
  return ""
})

onMounted(async () => {
  await loadManifest()
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
        <p v-if="normalizedVersion" class="mt-3 text-sm text-zinc-600">
          当前发布版本：{{ normalizedVersion }}
        </p>
      </div>

      <p v-if="loading" class="mt-10 text-center text-sm text-zinc-600">正在读取 R2 最新下载信息...</p>
      <p v-else-if="sectionMessage" class="mt-10 text-center text-sm text-zinc-600">{{ sectionMessage }}</p>

      <div v-if="!loading" class="mt-10 max-w-xl mx-auto">
        <div class="rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-center shadow-sm">
          <p class="text-sm text-zinc-600">Windows（当前唯一支持平台）</p>

          <a
            v-if="windowsDownloadLink"
            :href="windowsDownloadLink"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            免费下载 Windows 版
          </a>

          <p v-else class="mt-3 text-zinc-900 font-semibold">暂未发布</p>
        </div>
      </div>

      <p v-if="!loading && !hasWindowsDownload" class="mt-6 text-center text-xs text-zinc-500">
        发布新版本后，请先同步 Windows 安装包到 R2 并更新 latest.json。
      </p>
    </div>
  </section>
</template>
import { computed, ref } from "vue"

export type PlatformKey = "windows" | "macos" | "linux"

export interface UpdateManifest {
  version?: string
  dateLabel?: string
  downloadUrl?: string
  downloads?: Partial<Record<PlatformKey, string>>
}

const DEFAULT_R2_MANIFEST_URL = "https://dl.ylicen.top/latest.json"
const manifestUrl = import.meta.env.VITE_R2_MANIFEST_URL ?? DEFAULT_R2_MANIFEST_URL

const manifest = ref<UpdateManifest | null>(null)
const loading = ref(false)
const error = ref("")
let inFlight: Promise<void> | null = null

const loadManifest = async () => {
  if (inFlight) {
    await inFlight
    return
  }

  inFlight = (async () => {
    loading.value = true
    error.value = ""

    try {
      const response = await fetch(manifestUrl, { cache: "no-store" })
      if (!response.ok) {
        throw new Error(`R2 manifest request failed: ${response.status}`)
      }

      manifest.value = (await response.json()) as UpdateManifest
    } catch {
      manifest.value = null
      error.value = "当前无法读取 R2 下载清单，请稍后重试。"
    } finally {
      loading.value = false
      inFlight = null
    }
  })()

  await inFlight
}

const normalizedVersion = computed(() => {
  const rawVersion = manifest.value?.version?.trim() ?? ""
  if (!rawVersion) return ""
  return rawVersion.startsWith("v") ? rawVersion : `v${rawVersion}`
})

export const useReleaseManifest = () => ({
  manifest,
  loading,
  error,
  manifestUrl,
  normalizedVersion,
  loadManifest,
})

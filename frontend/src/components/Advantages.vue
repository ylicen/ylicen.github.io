<script setup lang="ts">
import { Zap, CheckCircle2, ShieldCheck } from "lucide-vue-next"

const items = [
  {
    title: "轻便轻量",
    desc: "极致优化体积，毫秒级快速启动。没有多余的依赖累赘，随时进入高效工作状态。",
    icon: Zap
  },
  {
    title: "开箱即用",
    desc: "一站式安装，内建所需功能，抛弃繁杂的配置环节。即装即用，平滑过渡。",
    icon: CheckCircle2
  },
  {
    title: "安全稳定",
    desc: "全面兼容各大主流协议，确保数据交互的安全与稳定，无后门与隐私泄露风险。",
    icon: ShieldCheck
  }
]
</script>

<template>
  <section id="advantages" class="py-20 lg:py-28 bg-zinc-50 border-y border-zinc-200/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-extrabold text-zinc-900 sm:text-4xl font-display tracking-tight">重新定义数据库管理</h2>
        <p class="mt-4 text-xl text-zinc-700">为什么选择 LuminaDB？</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(item, idx) in items" :key="idx" class="p-8 border border-zinc-200 rounded-3xl bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div class="w-12 h-12 flex items-center justify-center rounded-2xl mb-6 bg-zinc-100 ring-1 ring-zinc-200 shrink-0 text-zinc-700">
            <component :is="item.icon" class="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 class="text-xl font-bold text-zinc-900 mb-3 sm:mb-4">{{ item.title }}</h3>
          <p class="text-zinc-700 leading-relaxed text-sm sm:text-base">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Download, ChevronRight } from "lucide-vue-next"
</script>

<template>
  <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white overflow-hidden text-center">
    <!-- Light mode subtle grid background -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 mb-8 transition-colors duration-300 hover:bg-zinc-100 hover:border-zinc-300 cursor-default">
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-500 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-zinc-700"></span>
        </span>
        <span class="text-xs font-semibold text-zinc-700 tracking-wide uppercase">LuminaDB v1.0.0 现已发布</span>
      </div>
      
      <h1 class="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold text-zinc-900 tracking-tight leading-[1.15] mb-6 md:mb-8">
        为现代开发者打造的<br/>
        <span class="text-zinc-900">
          极速数据库套件
        </span>
      </h1>
      
      <p class="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-700 mb-10 md:mb-12 leading-relaxed px-4 sm:px-0">
        轻便、快速、高效的跨平台数据库管理工具。提供直观的数据操作、高效的表结构设计和强大的 SQL 查询能力，彻底释放数据生产力。
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20 px-4 sm:px-0">
        <a href="#download" class="group flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-200 shadow-sm shadow-zinc-900/10 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 w-full sm:w-auto">
          <Download class="w-5 h-5 -ml-1 transition-transform group-hover:-translate-y-0.5" />
          免费下载桌面版
        </a>
        <a href="#features" class="group flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 border-2 border-zinc-200 hover:border-zinc-300 px-8 py-3.5 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-200 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2">
          探索工作流
          <ChevronRight class="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" />
        </a>
      </div>
      
      <!-- 主视觉图 - 白底现代感 -->
      <div class="relative mx-auto max-w-5xl group perspective-1000 px-2 sm:px-0">
        <div class="absolute -inset-1 bg-gradient-to-b from-zinc-200/50 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
        <div class="rounded-xl sm:rounded-2xl shadow-2xl shadow-zinc-900/10 overflow-hidden ring-1 ring-zinc-900/5 relative bg-white transform transition-transform duration-500 hover:-translate-y-1">
          <div class="flex items-center px-4 py-3 bg-zinc-50/80 border-b border-zinc-200 backdrop-blur-sm">
            <div class="flex space-x-2">
              <div class="w-3 h-3 rounded-full bg-zinc-300 border border-zinc-400/20"></div>
              <div class="w-3 h-3 rounded-full bg-zinc-300 border border-zinc-400/20"></div>
              <div class="w-3 h-3 rounded-full bg-zinc-300 border border-zinc-400/20"></div>
            </div>
            <div class="mx-auto bg-white/60 text-zinc-700 text-xs px-3 py-1 rounded-md border border-zinc-200 font-mono shadow-sm">
              mysql -h 127.0.0.1 -P 3306 -u root -p
            </div>
          </div>
          <img src="/luminadb-overview-dashboard.jpg" alt="LuminaDB Dashboard 预览" class="w-full h-auto object-cover" loading="lazy">
        </div>
      </div>
    </div>
  </section>
</template>

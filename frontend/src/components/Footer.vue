<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-zinc-50 border-t border-zinc-200/80 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-4 justify-center sm:justify-start">
          <img src="/luminadb_icon.png" alt="LuminaDB" class="w-8 h-8 rounded opacity-90 ring-1 ring-zinc-900/5 shadow-sm" />
          <span class="font-display font-bold text-xl text-zinc-900 tracking-tight">LuminaDB</span>
        </div>
        <p class="text-zinc-700 max-w-xs mx-auto sm:mx-0 leading-relaxed text-sm sm:text-base">
          您的现代化桌面数据库管理平台。<br>专为高效率开发与数据运维而打造。
        </p>
      </div>
      
      <div class="pt-8 border-t border-zinc-200/80 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-zinc-700 text-sm">&copy; {{ currentYear }} LuminaDB. All rights reserved.</p>
        <p class="text-zinc-700 text-sm">Made with 🤍 by Ylicen</p>
      </div>
    </div>
  </footer>
</template>

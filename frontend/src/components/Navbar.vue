<script setup lang="ts">
import { ref } from "vue"
import { Menu, X } from "lucide-vue-next"

const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50">
    <!-- Navbar Container -->
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mt-4 backdrop-blur-md bg-white/80 border border-zinc-200/80 shadow-sm rounded-2xl px-4 sm:px-6 transition-all duration-300">
        <div class="flex justify-between items-center h-14">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <img src="/luminadb_icon.png" alt="LuminaDB Logo" class="w-8 h-8 rounded shrink-0 ring-1 ring-zinc-900/5 shadow-sm" />
            <span class="font-display font-bold text-xl text-zinc-900 tracking-tight">LuminaDB</span>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a href="#features" class="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 rounded-md px-2 py-1">核心特性</a>
            <a href="#advantages" class="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 rounded-md px-2 py-1">产品优势</a>
          </nav>

          <!-- Desktop Actions -->
          <div class="hidden md:flex items-center">
            <a href="#download" class="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm shadow-zinc-900/10 hover:shadow-md hover:-translate-y-0.5 focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:outline-none">
              免费下载
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <div class="flex md:hidden items-center">
            <button @click="toggleMobileMenu" class="text-zinc-700 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 rounded-md p-1" aria-label="Toggle Navigation">
              <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
              <X v-else class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Menu Dropdown -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
        <div v-show="isMobileMenuOpen" class="absolute left-4 right-4 top-[80px] bg-white border border-zinc-200 rounded-2xl shadow-xl p-4 md:hidden">
          <nav class="flex flex-col space-y-4">
            <a href="#features" @click="isMobileMenuOpen = false" class="block text-base font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 px-3 py-2 rounded-lg">核心特性</a>
            <a href="#advantages" @click="isMobileMenuOpen = false" class="block text-base font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 px-3 py-2 rounded-lg">产品优势</a>
            <a href="#download" @click="isMobileMenuOpen = false" class="block text-center w-full bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors mt-2">
              免费下载
            </a>
          </nav>
        </div>
      </transition>
    </div>
  </header>
</template>

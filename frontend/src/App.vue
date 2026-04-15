<script setup lang="ts">
import Navbar from "./components/Navbar.vue"
import Hero from "./components/Hero.vue"
import Advantages from "./components/Advantages.vue"
import Features from "./components/Features.vue"
import DownloadSection from "./components/DownloadSection.vue"
import Footer from "./components/Footer.vue"
</script>

<template>
  <div class="min-h-screen bg-white font-sans overflow-x-hidden">
    <Navbar />
    
    <main>
      <Hero />
      <Advantages />
      <Features />
      <DownloadSection />
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    title: "高优数据管理能力",
    desc: "像操作电子表格一样管理您的数据。内置强大且快速的数据表浏览视图，支持即时的行级插入、编辑与删除。",
    img: "/luminadb-table-products-grid.jpg",
    alt: "数据管理界面",
    reverse: false
  },
  {
    title: "现代化的表结构设计",
    desc: "告别冗长的 CREATE TABLE 语法。LuminaDB 提供直观的表格与字段设计弹窗，无论是设置各种类型、主键、非空约束还是自增等属性，都能轻松通过界面完成。",
    img: "/luminadb-create-table-dialog.jpg",
    alt: "新建表弹窗",
    reverse: true
  },
  {
    title: "强大的 SQL 查询台",
    desc: "为开发者量身打造的双栏查询界面。左侧高效编写 SQL 片段，支持关键字高亮与代码提示；右侧实时浏览执行结果日志，所见即所得。",
    img: "/luminadb-sql-console-result.jpg",
    alt: "SQL查询台结果预览",
    reverse: false
  },
  {
    title: "专注易用的配置调整",
    desc: "轻量级的设置中心。无论是客户端本地信息调整还是深浅色模式切换，我们都提供最直接的选项，不让多余的配置干扰你的思维。集成极简更新检查面板，时刻保持软件最新状态。",
    img: "/luminadb-settings-update-panel.jpg",
    alt: "设置与更新面板",
    reverse: true
  }
]
</script>

<template>
  <section id="features" class="py-20 lg:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 sm:mb-24">
        <h2 class="text-xs text-zinc-700 font-semibold tracking-wider uppercase mb-3">Core Functions</h2>
        <p class="mt-2 text-3xl sm:text-4xl leading-tight font-extrabold tracking-tight text-zinc-900 font-display">
          洞察并掌控你的数据
        </p>
        <p class="mt-4 max-w-2xl text-lg sm:text-xl text-zinc-700 mx-auto leading-relaxed">
          专为效能设计的数据库桌面套件，包含您所需的一切核心操作。
        </p>
      </div>

      <div class="space-y-24 sm:space-y-32">
        <div v-for="(feat, idx) in features" :key="idx" class="flex flex-col lg:flex-row items-center gap-10 lg:gap-20" :class="{'lg:flex-row-reverse': feat.reverse}">
          <div class="w-full lg:w-1/2 flex flex-col justify-center">
            <h3 class="text-2xl sm:text-3xl font-bold text-zinc-900 mb-4 sm:mb-6 font-display">{{ feat.title }}</h3>
            <p class="text-base sm:text-lg text-zinc-700 leading-relaxed mb-6 sm:mb-8">{{ feat.desc }}</p>
            <div class="w-12 h-1 bg-zinc-300 rounded-full"></div>
          </div>
          <div class="w-full lg:w-1/2 relative group">
            <div class="absolute -inset-1 sm:-inset-2 bg-zinc-100 rounded-2xl sm:rounded-[2rem] transform rotate-1 sm:rotate-2 group-hover:rotate-1 transition-transform duration-500 scale-95 opacity-50 shadow-sm"></div>
            <img :src="feat.img" :alt="feat.alt" class="relative w-full rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-zinc-200/60 object-cover bg-white transform transition-transform duration-300 hover:scale-[1.02]" loading="lazy">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

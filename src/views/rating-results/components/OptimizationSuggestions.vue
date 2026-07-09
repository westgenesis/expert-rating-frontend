<template>
  <n-card size="small" title="后续优化落地建议">
    <div class="grid gap-4" :style="suggestionGridStyle">
      <div
        v-for="(item, idx) in data"
        :key="idx"
        class="p-5 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <h4 class="text-slate-800 font-semibold mb-2 text-[15px]">
          {{ idx + 1 }}. {{ item.title }}
        </h4>
        <p class="text-sm text-slate-600 leading-relaxed">{{ item.content }}</p>
      </div>
      <div v-if="!data.length" class="text-center text-gray-400 py-8">暂无优化建议</div>
    </div>
  </n-card>
</template>

<script setup>
defineOptions({
  name: 'OptimizationSuggestions',
})

defineProps({
  /** 优化建议数组，每项包含 title/content */
  data: {
    type: Array,
    default: () => [],
  },
})

/** 响应式网格布局：宽屏自动双列 */
const suggestionGridStyle = {
  gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
}
</script>

<template>
  <n-card size="small" title="整体质量分析">
    <!-- 质量分析卡片网格 -->
    <div class="grid gap-5" :style="qualityGridStyle">
      <div
        v-for="(item, idx) in data"
        :key="idx"
        class="border border-gray-200 rounded-lg p-4"
      >
        <h4 class="flex justify-between items-center mb-2.5 text-[15px]">
          <span>{{ item.dimension }}</span>
          <n-tag
            :bordered="false"
            size="small"
            :type="getLevelTagType(item.level)"
            round
          >
            {{ item.level }}
          </n-tag>
        </h4>
        <p class="text-[13px] text-slate-500 leading-relaxed">
          {{ item.summary || '--' }}
        </p>
      </div>
      <div v-if="!data.length" class="text-center text-gray-400 py-8">暂无质量分析数据</div>
    </div>

    <!-- 综合结论 -->
    <div
      v-if="conclusion"
      class="mt-5 py-4 px-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-md"
    >
      <h4 class="text-blue-800 font-semibold mb-2">综合结论</h4>
      <p class="text-sm text-blue-900 leading-relaxed">{{ conclusion }}</p>
    </div>
  </n-card>
</template>

<script setup>
defineOptions({
  name: 'QualityAnalysis',
})

defineProps({
  /** 质量分析数组，每项包含 dimension/level/summary */
  data: {
    type: Array,
    default: () => [],
  },
  /** 综合结论文本 */
  conclusion: {
    type: String,
    default: '',
  },
})

/** 响应式网格布局 */
const qualityGridStyle = {
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
}

/**
 * 根据质量等级返回 n-tag 的 type
 * 优→success, 良→info, 中→warning, 差→error
 * @param {string} level - 等级（优/良/中/差）
 */
const getLevelTagType = (level) => {
  const typeMap = {
    优: 'success',
    良: 'info',
    中: 'warning',
    差: 'error',
  }
  return typeMap[level] || 'default'
}
</script>

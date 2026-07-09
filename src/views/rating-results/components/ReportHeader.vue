<template>
  <div class="mb-5 flex justify-between items-start">
    <div>
      <h1 class="text-2xl font-semibold text-slate-800 mb-2">评测结果</h1>
      <div class="text-sm text-slate-500">
        测试对象：<span class="text-slate-700 font-medium">{{ testObject || '--' }}</span>
      </div>
    </div>
    <n-button class="export-pdf-btn" @click="handleExport">
      导出PDF报告
    </n-button>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ReportHeader',
})

defineProps({
  /** 测试对象名称 */
  testObject: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['export'])

/**
 * 触发导出PDF事件
 */
const handleExport = () => {
  emit('export')
}
</script>

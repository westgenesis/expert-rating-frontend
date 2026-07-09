<template>
  <div class="mb-5">
    <h1 class="text-2xl font-semibold text-slate-800 mb-2">评测结果</h1>
    <div class="text-sm text-slate-500">
      测试对象：<span class="text-slate-700 font-medium">{{ testObject || '--' }}</span>
    </div>
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
</script>

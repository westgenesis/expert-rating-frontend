<template>
  <section>
    <n-h3 prefix="bar">
      <n-text> 评分内容 </n-text>
      <span class="ml-2 text-xs text-gray-400">请根据测试结果进行评分</span>
    </n-h3>

    <RatingFormContent />
  </section>
</template>

<script setup>
import RatingFormContent from './RatingFormContent.vue'
</script>

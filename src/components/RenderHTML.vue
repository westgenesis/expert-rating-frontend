<template>
  <n-ellipsis
    :tooltip="{
      placement: 'top',
    }"
    expand-trigger="click"
    line-clamp="3"
  >
    <div v-html="html"></div>

    <template #tooltip>
      <div>点击查看更多</div>
    </template>
  </n-ellipsis>
</template>

<script setup lang="ts">
defineProps({
  html: {
    type: String,
    default: '',
  },
})
</script>

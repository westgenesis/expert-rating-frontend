<template>
  <n-card size="small" :title="renderTittle" class="min-w-[100px]">
    <div class="text-2xl whitespace-nowrap">
      <span class="whitespace-nowrap">{{ value }}</span>
      <span v-if="unit">{{ unit }}</span>
    </div>
  </n-card>
</template>

<script setup lang="jsx">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  precision: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
  },
})

const renderTittle = () => <div class="text-gray-500 whitespace-nowrap">{props.title}</div>
</script>

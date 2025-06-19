<template>
  <div class="flex items-center text-white rounded-sm" :style="{ backgroundColor: color }">
    <div class="p-4">
      <n-icon size="40">
        <component :is="icon" />
      </n-icon>
    </div>

    <div
      class="h-full flex flex-col items-center justify-center py-2 px-4 min-w-[180px] border-l border-white text-lg"
    >
      <div>{{ title }}</div>
      <div class="font-semibold text-2xl mt-2">{{ value ? value.toFixed(2) : '--' }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  icon: {
    type: Object,
    required: true,
  },
})
</script>

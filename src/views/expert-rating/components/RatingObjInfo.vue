<template>
  <div class="bg-gray-100 mb-4 rounded-md p-4 flex items-center font-semibold">
    <h2 class="text-lg text-slate-500">测试对象</h2>
    <div class="ml-4 text-blue-600">{{ data?.name || '--' }}</div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'RatingObjInfo',
})

defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})
</script>

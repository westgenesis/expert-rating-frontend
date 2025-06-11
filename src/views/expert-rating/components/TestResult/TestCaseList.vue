<template>
  <n-card size="small" title="测试用例清单">
    <n-data-table :columns="columns" :data="data" />
  </n-card>
</template>

<script setup>
import { ref } from 'vue'

const data = ref([])
const columns = ref([
  {
    title: '用例编号',
  },
])
</script>

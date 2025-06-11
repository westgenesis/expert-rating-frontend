<template>
  <n-card size="small" title="缺陷清单">
    <n-data-table :columns="columns" :data="data" />
  </n-card>
</template>

<script setup>
import { ref } from 'vue'

const data = ref([])
const columns = ref([
  {
    title: '缺陷编号',
  },
])
</script>

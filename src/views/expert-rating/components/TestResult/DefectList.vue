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
    title: '编号',
    key: 'defectNumber',
  },
  {
    title: '缺陷名称',
    key: 'defectName',
  },
  {
    title: '状态',
    key: 'status',
  },
  {
    title: '被测对象',
    key: 'testedObject',
  },
  {
    title: '最后修改时间',
    key: 'lastModifiedTime',
  },
  {
    title: '创建时间',
    key: 'createTime',
  },
])
</script>

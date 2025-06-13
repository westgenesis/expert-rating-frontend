<template>
  <n-card size="small" title="测试用例清单">
    <n-data-table :columns="columns" :data="data" />
  </n-card>
</template>

<script setup lang="jsx">
import { ref } from 'vue'

const data = ref([])
const columns = ref([
  {
    title: '用例编号',
    key: 'testcaseNumber',
  },
  {
    title: '用例名称',
    key: 'testcaseName',
  },
  {
    title: '测试类型',
    key: 'testType',
    render: (row) => {
      if (!row.testType) {
        return
      }

      const testMap = {
        1: '自动测试',
        2: '手动测试',
      }

      return (
        <n-tag type="success">
          {row.testType
            .split(',')
            .map((item) => testMap[item])
            .join('&')}
        </n-tag>
      )
    },
  },
])
</script>

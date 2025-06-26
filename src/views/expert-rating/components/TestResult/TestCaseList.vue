<template>
  <n-card size="small" title="测试用例清单">
    <n-data-table :columns="columns" :data="showData" :loading="loading" :max-height="250" />
  </n-card>
</template>

<script setup lang="jsx">
import { computed, ref, watchEffect } from 'vue'
import { getTapGetTestCaseLists } from '@/services/apis'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
})

const data = ref([])
const columns = ref([
  {
    title: '用例编号',
    key: 'id',
  },
  {
    title: '用例名称',
    key: 'testcase_name',
  },
  {
    title: '所属模块',
    key: 'module',
    width: 100,
  },
  {
    title: '前置条件',
    key: 'preconditions',
    render: (row) => {
      return <n-ellipsis>{row.preconditions?.join(' ')}</n-ellipsis>
    },
  },
  // {
  //   title: '测试类型',
  //   key: '测试类型',
  //   render: (row) => {
  //     if (!row.testType) {
  //       return
  //     }

  //     const testMap = {
  //       1: '自动测试',
  //       2: '手动测试',
  //     }

  //     return (
  //       <n-tag type="success">
  //         {row.testType
  //           .split(',')
  //           .map((item) => testMap[item])
  //           .join('&')}
  //       </n-tag>
  //     )
  //   },
  // },
  {
    title: '测试优先级',
    key: 'priority',
  },
  {
    title: '测试描述',
    key: 'description',
    render: (row) => {
      return <n-ellipsis>{row.description}</n-ellipsis>
    },
  },
])

const showData = computed(() => {
  if (!data.value.length) {
    return []
  }

  const flattenTestData = (data) => {
    return data.reduce((list, item) => [...list, ...(item?.testcase_list || [])], [])
  }

  return flattenTestData(data.value)
})

const loading = ref(false)
const getTestCaseList = async () => {
  loading.value = true
  const res = await getTapGetTestCaseLists({
    name: props.name,
    testsuite_id: props.type || undefined,
  })

  data.value = res.data || []
  loading.value = false
}

watchEffect(() => {
  getTestCaseList()
})
</script>

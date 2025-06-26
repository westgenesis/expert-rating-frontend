<template>
  <n-card size="small" title="测试用例清单">
    <n-data-table :columns="columns" :data="data" :loading="loading" :max-height="250" />

    <n-pagination
      class="mt-4 justify-end"
      :page="pagination.page"
      :page-size="pagination.pageSize"
      @update-page="pagination.onChange"
      @update-page-size="pagination.onUpdatePageSize"
      :item-count="pagination.itemCount"
      show-size-picker
      :page-sizes="[10, 20, 30, 40]"
    />
  </n-card>
</template>

<script setup lang="jsx">
import { reactive, ref, watchEffect } from 'vue'
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

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange: (page) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
})

const data = ref([])
const columns = ref([
  {
    title: '所属测试集',
    key: 'testsuite_id',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '用例编号',
    key: '用例编号',
  },
  {
    title: '用例名称',
    key: '用例名称',
  },
  {
    title: '所属模块',
    key: '所属模块',
    width: 100,
  },
  {
    title: '前置条件',
    key: '前置条件',
    render: (row) => {
      return <n-ellipsis>{row['前置条件']?.join(' ')}</n-ellipsis>
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
    key: '测试优先级',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '测试描述',
    key: '测试描述',
    render: (row) => {
      return <n-ellipsis>{row['测试描述']}</n-ellipsis>
    },
  },
])

const loading = ref(false)
const getTestCaseList = async () => {
  loading.value = true
  const res = await getTapGetTestCaseLists({
    name: props.name,
    testsuite_id: props.type || undefined,
    page: pagination.page,
    page_size: pagination.pageSize,
  })
  data.value = res.data?.data || []
  pagination.itemCount = res.data?.total || 0
  loading.value = false
}

watchEffect(() => {
  getTestCaseList()
})
</script>

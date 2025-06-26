<template>
  <n-card size="small" title="缺陷清单">
    <n-data-table :columns="columns" :data="data" :loading="loading" max-height="250" />

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

<script setup>
import { ref, reactive, watchEffect } from 'vue'

import { getTapGetDefectLists } from '@/services/apis'

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
    title: '所属测试集',
    key: 'testsuite_id',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '缺陷名称',
    key: '缺陷名称',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '严重程度',
    key: '严重程度',
    width: 80,
  },
  {
    title: '发生频率',
    key: '发生频率',
    width: 80,
  },

  {
    title: '重现步骤',
    key: '重现步骤',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '所属模块',
    key: '所属模块',
    width: 100,
  },
  {
    title: '缺陷场景',
    key: '缺陷场景',
    ellipsis: {
      tooltip: true,
    },
  },
])

const loading = ref(false)

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

const getDefectList = async () => {
  loading.value = true
  const res = await getTapGetDefectLists({
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
  getDefectList()
})
</script>

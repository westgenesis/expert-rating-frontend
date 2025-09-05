<template>
  <n-card title="历史打分记录">
    <n-data-table :columns="columns" :data="data" />

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
import { ref, watchEffect } from 'vue'
import { getTapAllScoreHistory } from '@/services/apis'
import { format } from 'date-fns'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = ref([])

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

const columns = ref([
  {
    title: '序号',
    width: 80,
    render(row, index) {
      return index + 1
    },
  },
  {
    title: '评分时间',
    key: '评分时间',
    width: 150,
    render(row) {
      return row['评分时间'] ? format(new Date(row['评分时间']), 'yyyy-MM-dd HH:mm:ss') : ''
    },
  },
  { title: '测试对象', key: '测试对象', width: 150 },
  { title: '客观得分', key: '客观得分', width: 120 },
  { title: '主观得分', key: '主观得分', width: 120 },
  { title: '综合得分', key: '综合得分', width: 120 },
  { title: '评分专家', key: '评分专家', width: 120 },
  {
    title: '操作',
    key: 'action',
    width: 100,
    render(row) {
      return (
        <n-button quaternary type="info" onClick={() => handleView(row)}>
          查看
        </n-button>
      )
    },
  },
])

const handleView = (row) => {
  const url = router.resolve({
    name: 'rating-results',
    query: {
      data_id: row['data_id'],
    },
  }).href
  window.open(url, '_blank')
}

const getRatingHistory = async () => {
  const res = await getTapAllScoreHistory({
    page: pagination.page,
    page_size: pagination.pageSize,
  })
  data.value = res.data?.data || []
  pagination.itemCount = res.data?.total || 0
}

watchEffect(() => {
  getRatingHistory()
})
</script>

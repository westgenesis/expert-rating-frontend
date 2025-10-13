<template>
  <n-card size="small" title="缺陷清单">
    <n-data-table :columns="columns" :data="data" :loading="loading" />

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
import { ref, reactive, watchEffect } from 'vue'
import RenderHTML from '@/components/RenderHTML.vue'
import { getTapGetDefectLists } from '@/services/apis'

const props = defineProps({
  dataId: {
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
    key: 'testsuite_name',
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '缺陷名称',
    key: '缺陷名称',
    width: 240,
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
    title: '缺陷场景',
    key: '缺陷场景',
    render: (row) => {
      return <RenderHTML html={row['缺陷场景']} />
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
    data_id: props.dataId,
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

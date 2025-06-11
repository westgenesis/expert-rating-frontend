<template>
  <n-card size="small" title="主观评价详情">
    <n-data-table :columns="columns" :data="data" />
  </n-card>

  <n-modal
    v-model:show="detailVisible"
    title="专家打分详情"
    preset="card"
    size="medium"
    style="width: 600px"
  >
    <RatingFormContent previewMode>
      <template #prefix>
        <n-form-item label-placement="left" path="name" label="专家：">
          {{ currentRow.name }}
        </n-form-item>
      </template>
    </RatingFormContent>
  </n-modal>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import formate from 'date-fns/format'

import RatingFormContent from '@/views/expert-rating/components/RatingForm/RatingFormContent.vue'

const data = ref([
  {
    name: '专家1',
    score: '',
    updateTime: '2023-10-01',
    remark: '备注',
  },
  {
    name: '专家2',
    score: '',
    updateTime: '2023-10-20',
    remark: '备注',
  },
])

const columns = ref([
  // 评分专家 评分 更新时间 备注
  {
    title: '评分专家',
    key: 'name',
  },
  {
    title: '评分',
    key: 'score',
    render(row) {
      return row.score ? row.score : <span class="text-red-500">未提交</span>
    },
  },
  {
    title: '更新时间',
    key: 'updateTime',
    render(row) {
      return row.updateTime ? formate(new Date(row.updateTime), 'yyyy-MM-dd HH:mm:ss') : ''
    },
  },
  {
    title: '备注',
    key: 'remark',
  },
  {
    title: '操作',
    width: 120,
    align: 'center',
    render(row) {
      return (
        <n-button quaternary type="info" onClick={() => handleView(row)}>
          详情
        </n-button>
      )
    },
  },
])

const currentRow = ref(null)
const detailVisible = ref(false)

const handleView = (row) => {
  currentRow.value = row
  detailVisible.value = true
}
</script>

<template>
  <n-card size="small" title="主观评价详情">
    <n-spin :show="loading" :delay="1000">
      <n-data-table :columns="columns" :data="data" />
    </n-spin>
  </n-card>

  <n-modal
    v-model:show="detailVisible"
    title="专家打分详情"
    preset="card"
    size="medium"
    style="width: 600px"
  >
    <RatingForm previewMode :ratingMatrixFormData="ratingMatrixFormData">
      <template #prefix>
        <n-form-item label-placement="left" path="name" label="专家：">
          {{ currentRow['评分专家'] }}
        </n-form-item>
      </template>
    </RatingForm>
  </n-modal>
</template>

<script setup lang="jsx">
import { computed, onMounted, ref } from 'vue'
import formate from 'date-fns/format'
import { getTapScoreHistory } from '@/services/apis'
import RatingForm from '@/views/expert-rating/components/RatingForm/RatingForm.vue'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
})

const data = ref([])

const columns = ref([
  // 评分专家 评分 更新时间 备注
  {
    title: '评分专家',
    key: '评分专家',
  },
  {
    title: '评分',
    key: '评分',
    render(row) {
      return row['评分'] ? row['评分'] : <span class="text-red-500">未提交</span>
    },
  },
  {
    title: '更新时间',
    key: '更新时间',
    render(row) {
      return row['更新时间'] ? formate(new Date(row['更新时间']), 'yyyy-MM-dd HH:mm:ss') : ''
    },
  },
  {
    title: '备注',
    key: '备注',
    render(row) {
      return row['备注'] ? row['备注'] : '-'
    },
  },
  {
    title: '操作',
    width: 120,
    align: 'center',
    render(row) {
      return row['详情'] ? (
        <n-button quaternary type="info" onClick={() => handleView(row)}>
          详情
        </n-button>
      ) : null
    },
  },
])

const loading = ref(false)

const currentRow = ref(null)
const detailVisible = ref(false)

const ratingMatrixFormData = computed(() => {
  if (!currentRow.value['详情']) {
    return {
      ratingData: [],
      remark: '',
    }
  }
  const ratingData = Object.entries(currentRow.value['详情']).map(([key, info]) => ({
    dimensionName: key,
    configs: info.all.map((item) => ({
      name: item,
      value: item,
    })),
    value: info.active,
  }))
  return {
    ratingData,
    remark: currentRow.value['备注'],
  }
})

const getScoreHistory = async () => {
  loading.value = true
  const response = await getTapScoreHistory({
    name: props.name,
  })
  data.value = response?.data || []
  loading.value = false
}

const handleView = (row) => {
  currentRow.value = row
  detailVisible.value = true
}

onMounted(() => {
  getScoreHistory()
})
</script>

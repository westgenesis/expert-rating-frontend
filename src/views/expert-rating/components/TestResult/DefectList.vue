<template>
  <n-card size="small" title="缺陷清单">
    <n-data-table :columns="columns" :data="showData" :loading="loading" max-height="250" />
  </n-card>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

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
    title: '缺陷名称',
    key: 'title',
    width: 200,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '严重程度',
    key: 'severity',
    width: 80,
  },
  {
    title: '发生频率',
    key: 'frequency',
    width: 80,
  },

  {
    title: '重现步骤',
    key: 'reproduction_steps',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '所属模块',
    key: 'module',
    width: 100,
  },
  {
    title: '缺陷场景',
    key: 'defect_scenario',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
])

const showData = computed(() => {
  if (!data.value.length) {
    return []
  }

  const flattenTestData = (data) => {
    return data.reduce((list, item) => [...list, ...(item?.defect_info || [])], [])
  }

  return flattenTestData(data.value)
})

const loading = ref(false)

const getDefectList = async () => {
  loading.value = true
  const res = await getTapGetDefectLists({
    name: props.name,
    testsuite_id: props.type || undefined,
  })
  data.value = res.data || []
  loading.value = false
}

watchEffect(() => {
  getDefectList()
})
</script>

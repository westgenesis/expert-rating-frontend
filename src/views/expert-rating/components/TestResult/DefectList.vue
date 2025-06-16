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
  // {
  //   title: '编号',
  //   key: 'defectNumber',
  // },
  {
    title: '缺陷名称',
    // key: 'defectName',
    key: '缺陷名称',
    width: 200,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '状态',
    key: '状态',
    width: 100,
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
    title: '描述信息',
    key: '描述信息',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '解决方案',
    key: '解决方案',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '问题原因',
    key: '问题原因',
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
    const result = []

    data.forEach((item) => {
      const nameMap = item['*缺陷名称'] || {}

      // 获取所有 ID，并按数值排序
      const keys = Object.keys(nameMap).sort((a, b) => Number(a) - Number(b))

      keys.forEach((key) => {
        result.push({
          严重程度: item['*严重程度'][key] || '',
          状态: item['*状态'][key] || '',
          缺陷名称: nameMap[key] || '',
          发生频率: item['发生频率'][key] || '',
          描述信息: item['描述信息'][key] || '',
          解决方案: item['解决方案'][key] || '',
          问题原因: item['问题原因'][key] || '',
        })
      })
    })

    return result
  }

  return flattenTestData(data.value)
})

const loading = ref(false)

const getDefectList = async () => {
  loading.value = true
  const res = await getTapGetDefectLists({
    name: props.name,
    type: props.type,
  })
  data.value = res.data || []
  loading.value = false
}

watchEffect(() => {
  getDefectList()
})
</script>

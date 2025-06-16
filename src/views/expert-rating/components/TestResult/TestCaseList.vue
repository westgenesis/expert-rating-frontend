<template>
  <n-card size="small" title="测试用例清单">
    <n-data-table :columns="columns" :data="showData" :loading="loading" :max-height="250" />
  </n-card>
</template>

<script setup lang="jsx">
import { computed, ref, onMounted } from 'vue'
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
    // key: 'testcaseNumber',
    key: '用例编号',
  },
  {
    title: '用例名称',
    // key: 'testcaseName',
    key: '用例名称',
  },
  {
    title: '测试类型',
    key: '测试类型',
    // render: (row) => {
    //   if (!row.testType) {
    //     return
    //   }

    //   const testMap = {
    //     1: '自动测试',
    //     2: '手动测试',
    //   }

    //   return (
    //     <n-tag type="success">
    //       {row.testType
    //         .split(',')
    //         .map((item) => testMap[item])
    //         .join('&')}
    //     </n-tag>
    //   )
    // },
  },
])

const showData = computed(() => {
  if (!data.value.length) {
    return []
  }

  const flattenTestData = (data) => {
    const result = []

    data.forEach((item) => {
      const testObject = item['测试对象']
      const typeMap = item['测试类型'] || {}
      const nameMap = item['用例名称'] || {}
      const idMap = item['用例编号'] || {}

      // 获取所有 ID，并按数值排序
      const keys = Object.keys(idMap).sort((a, b) => Number(a) - Number(b))

      keys.forEach((key) => {
        result.push({
          测试对象: testObject,
          测试类型: typeMap[key] || '',
          用例名称: nameMap[key] || '',
          用例编号: idMap[key] || '',
        })
      })
    })

    return result
  }

  return flattenTestData(data.value)
})

const loading = ref(false)
const getTestCaseList = async () => {
  loading.value = true
  const res = await getTapGetTestCaseLists({
    name: props.name,
    // type: props.type,
  })

  data.value = res.data || []
  loading.value = false
}

onMounted(() => {
  getTestCaseList()
})
</script>

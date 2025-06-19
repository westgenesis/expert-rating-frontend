<template>
  <n-select v-model:value="selectedValue" :options="options" placeholder="请选择" />
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getTapTestCaseIds } from '@/services/apis'
const router = useRouter()
const route = useRoute()
const options = ref([])
const selectedValue = ref('')

const getTestCaseList = async () => {
  const res = await getTapTestCaseIds()

  options.value = (res.data || []).map((item) => ({
    label: item['测试对象'],
    value: item['测试对象'],
  }))
}

watch(selectedValue, (newVal) => {
  // 刷新当前页面，添加或更新query里面的name
  router.push({
    name: route.name,
    query: {
      ...(route.query || {}),
      name: newVal,
    },
  })
  setTimeout(() => {
    location.reload()
  }, 1000)
})

onMounted(() => {
  getTestCaseList()
})
</script>

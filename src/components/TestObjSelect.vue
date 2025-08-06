<template>
  <n-select
    v-model:value="selectedValue"
    :options="options"
    placeholder="请选择"
    style="width: 300px"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useRatingObj from '@/hooks/useRatingObj'
const router = useRouter()
const route = useRoute()

const selectedValue = ref(route.query.data_id)

const { testObjList } = useRatingObj()

watch(
  () => route.query.data_id,
  (newVal) => {
    selectedValue.value = newVal
  },
)

const options = computed(() => {
  return (testObjList.value || []).map((item) => ({
    label: item['测试对象'],
    value: item.data_id,
  }))
})

watch(selectedValue, (newVal) => {
  // 刷新当前页面，添加或更新query里面的name
  router.push({
    name: route.name,
    query: {
      ...(route.query || {}),
      data_id: newVal,
    },
  })
  setTimeout(() => {
    location.reload()
  }, 1000)
})
</script>

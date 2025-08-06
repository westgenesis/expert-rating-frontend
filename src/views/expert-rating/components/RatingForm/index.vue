<template>
  <section>
    <n-h3 prefix="bar">
      <n-text> 评分内容 </n-text>
      <span class="ml-2 mr-2 text-xs text-gray-400">请根据测试结果进行评分</span>
      <n-button size="small" type="primary" @click="getRecommend" :loading="loading"
        >推荐评分</n-button
      >
    </n-h3>
    <n-spin :show="loading">
      <RatingFormContent :recommendData="recommendData" />
    </n-spin>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import RatingFormContent from './RatingFormContent.vue'
import { getAlearnRecommend } from '@/services/apis.js'
import useRatingObj from '@/hooks/useRatingObj'
import { useMessage } from 'naive-ui'

const ratingObj = useRatingObj()
const message = useMessage()
const loading = ref(false)

const recommendData = ref(null)

const getRecommend = async () => {
  loading.value = true
  try {
    const res = await getAlearnRecommend({
      name: ratingObj.name,
    })
    recommendData.value = res.data
    message.success('获取推荐评分成功')
  } finally {
    loading.value = false
  }
}
</script>

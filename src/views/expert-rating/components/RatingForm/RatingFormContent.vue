<template>
  <n-spin :show="getConfigLoading">
    <RatingForm
      :ratingMatrixFormData="ratingMatrixFormData"
    />
    <div class="flex mt-2 justify-end" v-if="!previewMode">
      <n-space>
        <n-button type="tertiary" @click="handleReset"> 重置 </n-button>
        <n-button @click="handleSave"> 保存 </n-button>
        <n-button type="primary" @click="handleSubmit"> 提交 </n-button>
      </n-space>
    </div>
  </n-spin>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import RatingForm from './RatingForm.vue'

import { getShowExpertRatingMatrix } from '@/services/apis.js'

const ratingMatrix = ref([])

const ratingMatrixFormRef = ref(null)
const ratingMatrixFormData = ref({
  ratingData: [],
  remark: '',
})

const ratingMatrixSerialized = computed(() =>
  ratingMatrix.value.map((item) => {
    // 获取维度和配置对象
    const [dimensionName, ratingConfig] = Object.entries(item)[0]

    // 转换评分配置
    const configs = Object.entries(ratingConfig).map(([name, value]) => ({
      name,
      value,
    }))

    return {
      dimensionName,
      configs,
    }
  }),
)

watch(ratingMatrixSerialized, (newValue) => {
  ratingMatrixFormData.value.ratingData = newValue.map((item) => {
    return {
      dimensionName: item.dimensionName,
      configs: item.configs,
      value: '',
    }
  })
})

const getConfigLoading = ref(false)

const getRatingMatrix = async () => {
  try {
    getConfigLoading.value = true
    const response = await getShowExpertRatingMatrix()
    ratingMatrix.value = response?.data?.expert_rating_matrix || []
    // 处理获取到的数据
  } catch (error) {
    console.error('获取评分矩阵失败:', error)
  } finally {
    getConfigLoading.value = false
  }
}

const handleReset = () => {
  // 重置表单
  ratingMatrixFormRef.value.resetFields()
  ratingMatrixFormData.value = {
    ratingData: ratingMatrixFormData.value.ratingData.map((item) => {
      return {
        ...item,
        value: '',
      }
    }),
    remark: '',
  }
}

const handleSave = () => {}

const handleSubmit = () => {}

onMounted(() => {
  getRatingMatrix()
})
</script>

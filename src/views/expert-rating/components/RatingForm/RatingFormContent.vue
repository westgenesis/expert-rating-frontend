<template>
  <n-spin :show="getConfigLoading">
    <RatingForm
      :disabled="!isTemp"
      ref="ratingMatrixFormRef"
      :ratingMatrixFormData="ratingMatrixFormData"
    />
    <div class="flex mt-2 justify-end" v-if="!previewMode && isTemp">
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
import { useMessage } from 'naive-ui'
import RatingForm from './RatingForm.vue'

import {
  getTapReadScorePayload,
  getShowExpertRatingMatrix,
  postTapSendScorePayload,
} from '@/services/apis.js'
import useRatingObj from '@/hooks/useRatingObj'

const ratingObj = useRatingObj()

const message = useMessage()

const hasHistoryData = ref(false) // 是否有历史数据
const isTemp = ref(true) // 是否是临时保存数据

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
  ratingMatrixFormRef.value.restoreValidation()
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

const handleSave = async () => {
  await postTapSendScorePayload({
    name: ratingObj.name,
    payload: {
      data: ratingMatrixFormData.value,
      isTemp: true,
    },
  })
    .then(() => {
      message.success('保存评分成功')
    })
    .catch((error) => {
      console.error('保存评分失败:', error)
    })
}

const handleSubmit = async () => {
  const valid = await ratingMatrixFormRef.value.validate()
  if (valid.warnings) {
    return
  }
  await postTapSendScorePayload({
    name: ratingObj.name,
    payload: {
      data: ratingMatrixFormData.value,
      isTemp: false,
    },
  })
    .then(() => {
      message.success('提交评分成功')
    })
    .catch((error) => {
      console.error('提交评分失败:', error)
    })
}

const getScore = async () => {
  await getTapReadScorePayload({
    name: ratingObj.name,
  })
    .then((res) => {
      console.log(res)
      if (res.data && res.data.payload) {
        hasHistoryData.value = true
        ratingMatrixFormData.value = res.data?.payload.data
        isTemp.value = res.data?.payload?.isTemp
      }
    })
    .catch((error) => {
      console.error('获取评分失败:', error)
    })
}

onMounted(async () => {
  await getScore()
  // 没有历史数据，获取评分矩阵进行初始化
  if (!hasHistoryData.value) {
    getRatingMatrix()
  }
})
</script>

<template>
  <n-card title="客观评分矩阵">
    <template #header-extra>
      <n-space>
        <n-button secondary type="primary" @click="handleAddDimension">
          <template #icon>
            <NIcon>
              <Add />
            </NIcon>
          </template>
          添加评分维度
        </n-button>

        <n-button type="primary" @click="handleSubmit" :loading="submitting"> 提交更新 </n-button>
      </n-space>
    </template>

    <div>
      <n-skeleton v-if="loading" text :repeat="6" />
      <RatingMatrixForm
        ref="ratingMatrixFormRef"
        v-else
        :model="ratingMatrixFormData"
        @remove="handleRemoveDimension"
      />
    </div>
  </n-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Add } from '@vicons/carbon'
import { useMessage } from 'naive-ui'
import { getShowObjectiveRatingMatrix, updateObjectiveRatingMatrix } from '@/services/apis.js'

import RatingMatrixForm from './RatingMatrixForm.vue'

defineOptions({
  name: 'RatingMatrix',
})

const message = useMessage()
const loading = ref(false)
const ratingMatrix = ref([])
const ratingMatrixFormData = ref({
  data: [],
})
const ratingMatrixFormRef = ref(null)

watch(ratingMatrix, (newValue) => {
  const data = Object.entries(newValue).map(([dimensionName, ratingConfig]) => ({
    dimensionName,
    configs: Object.entries(ratingConfig).map(([name, value]) => ({
      name,
      value,
    })),
  }))

  ratingMatrixFormData.value = { data }
})

const getRatingMatrix = async () => {
  try {
    loading.value = true
    const response = await getShowObjectiveRatingMatrix()
    ratingMatrix.value = response?.data?.objective_rating_matrix || []
    // 处理获取到的数据
  } catch (error) {
    console.error('获取评分矩阵失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAddDimension = () => {
  // 添加评分维度逻辑
  const newDimension = {
    dimensionName: '',
    configs: [{ name: '', value: '' }],
  }
  ratingMatrixFormData.value.data.push(newDimension)
}

const handleRemoveDimension = (index) => {
  // 移除评分维度逻辑
  ratingMatrixFormData.value.data.splice(index, 1)
}

const submitting = ref(false)
const handleSubmit = () => {
  ratingMatrixFormRef.value.validate().then(() => {
    submitting.value = true
    const updatedMatrix = ratingMatrixFormData.value.data.reduce((acc, item) => {
      acc[item.dimensionName] = item.configs.reduce((acc, config) => {
        acc[config.name] = config.value
        return acc
      }, {})
      return acc
    }, {})

    updateObjectiveRatingMatrix({ objective_rating_matrix: updatedMatrix })
      .then((data) => {
        if (data?.data?.status === '成功') {
          message.success('评分矩阵更新成功')
        }
      })
      .catch((error) => {
        message.error('更新评分矩阵失败:', error)
      })
      .finally(() => {
        submitting.value = false
      })
  })
}

onMounted(() => {
  getRatingMatrix()
})
</script>

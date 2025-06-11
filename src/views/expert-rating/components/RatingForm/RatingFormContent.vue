<template>
  <n-spin :show="getConfigLoading">
    <n-form
      :disabled="previewMode"
      ref="ratingMatrixFormRef"
      :model="ratingMatrixFormData"
      v-if="!!ratingMatrix.length"
    >
      <slot name="prefix"></slot>
      <n-form-item class="-mt-8">
        <div class="flex overflow-x-auto">
          <div>
            <div
              class="tracking-widest w-10 h-[80px] bg-[#8FADD6] flex items-center justify-center text-white"
              style="writing-mode: vertical-rl; text-orientation: upright"
            >
              评分维度
            </div>
            <div
              class="tracking-widest w-10 h-[200px] bg-[#D7D7D7] flex items-center justify-center"
              style="writing-mode: vertical-rl; text-orientation: upright"
            >
              评分
            </div>
          </div>

          <div class="flex items-stretch gap-2">
            <div v-for="(item, index) in ratingMatrixFormData.ratingData" :key="index">
              <div
                class="text-md font-bold px-6 h-[80px] bg-[#D4DEEF] flex items-center justify-center text-[#0054A7]"
              >
                {{ item.dimensionName }}
              </div>
              <div class="h-[200px] px-2 bg-[#F2F2F2] flex items-center justify-center">
                <n-radio-group v-model:value="item.value">
                  <div class="flex flex-col gap-4">
                    <n-radio
                      v-for="configItem in item.configs"
                      :key="configItem.value"
                      :value="configItem.value"
                    >
                      {{ configItem.name }} ({{ configItem.value }})
                    </n-radio>
                  </div>
                </n-radio-group>
              </div>
            </div>
          </div>
        </div>
      </n-form-item>
      <n-form-item path="remark" label="备注">
        <n-input v-model:value="ratingMatrixFormData.remark" type="textarea" show-count clearable />
      </n-form-item>
      <div class="flex mt-2 justify-end" v-if="!previewMode">
        <n-space>
          <n-button type="tertiary" @click="handleReset"> 重置 </n-button>
          <n-button @click="handleSave"> 保存 </n-button>
          <n-button type="primary" @click="handleSubmit"> 提交 </n-button>
        </n-space>
      </div>
    </n-form>
  </n-spin>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import { getShowExpertRatingMatrix } from '@/services/apis.js'

const props = defineProps({
  previewMode: {
    type: Boolean,
  },
})

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

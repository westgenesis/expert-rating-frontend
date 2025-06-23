<template>
  <n-card title="系数设置">
    <template #header-extra>
      <n-space>
        <n-button type="primary" @click="handleSubmit" :loading="submitting"> 提交更新 </n-button>
      </n-space>
    </template>

    <div>
      <n-skeleton v-if="loading" text :repeat="2" />
      <!-- 使用n-form来提交 -->
      <n-form
        v-else
        label-width="120px"
        label-placement="left"
        inline
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <n-form-item path="data.subjective" label="主观评分系数">
          <n-input-number
            placeholder="请输入主观评分系数"
            v-model:value="formData.data.subjective"
            :min="0"
            :max="1"
            :step="0.01"
          />
        </n-form-item>
        <n-form-item path="data.objective" label="客观评分系数">
          <n-input-number
            placeholder="请输入客观评分系数"
            v-model:value="formData.data.objective"
            :min="0"
            :max="1"
            :step="0.01"
          />
        </n-form-item>
      </n-form>
    </div>
  </n-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { postTapUpdateZongheSettings, getTapGetZongheSettings } from '@/services/apis'
import { useMessage } from 'naive-ui'

const message = useMessage()
const loading = ref(false)
const formRef = ref(null)

const submitting = ref(null)
const formData = ref({
  data: {
    subjective: null, // 主观评分系数
    objective: null, // 客观评分系数
  },
})

const rules = ref({
  subjective: [{ required: true, message: '请输入主观评分系数', trigger: ['blur', 'change'] }],
  objective: [{ required: true, message: '请输入客观评分系数', trigger: ['blur', 'change'] }],
})

const handleSubmit = async () => {
  submitting.value = true
  formRef.value.validate().then(() => {
    postTapUpdateZongheSettings({
      keguan: formData.value.data.objective,
      zhuguan: formData.value.data.subjective,
    })
      .then((data) => {
        if (data?.data?.status === '成功') {
          message.success('更新系数成功')
        }
      })
      .catch((error) => {
        message.error('更新系数失败:', error)
      })
      .finally(() => {
        submitting.value = false
      })
  })
}

const getCoefficient = async () => {
  loading.value = true

  const getObjective = getTapGetZongheSettings({
    name: 'keguan',
  })
  const getSubjective = getTapGetZongheSettings({
    name: 'zhuguan',
  })

  const res = await Promise.all([getObjective, getSubjective]).finally(() => {
    loading.value = false
  })
  if (res[0]?.data?.status === '成功') {
    formData.value.data.objective = res[0].data.value
  }
  if (res[1]?.data?.status === '成功') {
    formData.value.data.subjective = res[1].data.value
  }
}

onMounted(() => {
  getCoefficient()
})
</script>

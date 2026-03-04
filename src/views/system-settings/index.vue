<template>
  <n-card title="系统设置">
    <template #header-extra>
      <n-space v-if="!loading">
        <n-popconfirm @positive-click="handleReset">
          <template #trigger>
            <n-button> 恢复系统设置 </n-button>
          </template>
          将更新所有设置为系统默认值，是否继续？
        </n-popconfirm>

        <n-button type="primary" @click="() => handleSubmit()" :loading="submitting">
          提交更新
        </n-button>
      </n-space>
    </template>

    <div>
      <n-skeleton v-if="loading" text :repeat="Object.keys(formData).length" />
      <!-- 使用n-form来提交 -->
      <n-form
        v-else
        label-width="180px"
        label-placement="left"
        ref="formRef"
        :model="formData"
        :rules="rules"
      >
        <n-form-item path="deduplicate_threshold" label="去重阈值">
          <ResetWrapper
            :originalValue="data?.system_config.deduplicate_threshold"
            v-model="formData.deduplicate_threshold"
          >
            <n-input-number
              placeholder="请输入去重阈值，范围0-1"
              v-model:value="formData.deduplicate_threshold"
              :min="0"
              :max="1"
              :step="0.01"
            />
          </ResetWrapper>
        </n-form-item>

        <n-form-item path="failure_score_limit" label="失败分数上限">
          <ResetWrapper
            :originalValue="data?.system_config.failure_score_limit"
            v-model="formData.failure_score_limit"
          >
            <n-input-number
              placeholder="请输入失败分数上限，范围0-100"
              v-model:value="formData.failure_score_limit"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
            />
          </ResetWrapper>
        </n-form-item>

        <n-form-item path="execute_score_limit" label="执行分数上限">
          <ResetWrapper
            :originalValue="data?.system_config.execute_score_limit"
            v-model="formData.execute_score_limit"
          >
            <n-input-number
              placeholder="请输入执行分数上限，范围0-100"
              v-model:value="formData.execute_score_limit"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
            />
          </ResetWrapper>
        </n-form-item>

        <n-form-item path="recommend_use_llm" label="是否启用大模型推荐">
          <ResetWrapper
            :originalValue="data?.system_config.recommend_use_llm"
            v-model="formData.recommend_use_llm"
          >
            <n-switch v-model:value="formData.recommend_use_llm" />
          </ResetWrapper>
        </n-form-item>

        <n-form-item path="evaluate_smart_cockpit_prompt" label="优先级划分提示词">
          <ResetWrapper
            :originalValue="data?.system_config.evaluate_smart_cockpit_prompt"
            v-model="formData.evaluate_smart_cockpit_prompt"
          >
            <n-input
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 10,
              }"
              v-model:value="formData.evaluate_smart_cockpit_prompt"
            />
          </ResetWrapper>
        </n-form-item>

        <n-form-item path="test_case_duplication_prompt" label="用例同源判断提示词">
          <ResetWrapper
            :originalValue="data?.system_config.test_case_duplication_prompt"
            v-model="formData.test_case_duplication_prompt"
          >
            <n-input
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 10,
              }"
              v-model:value="formData.test_case_duplication_prompt"
            />
          </ResetWrapper>
        </n-form-item>

        <n-form-item
          path="test_case_duplication_with_tolerance_prompt"
          label="同源判断(容差)提示词"
        >
          <ResetWrapper
            :originalValue="data?.system_config.test_case_duplication_with_tolerance_prompt"
            v-model="formData.test_case_duplication_with_tolerance_prompt"
          >
            <n-input
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 10,
              }"
              v-model:value="formData.test_case_duplication_with_tolerance_prompt"
            />
          </ResetWrapper>
        </n-form-item>

        <n-form-item path="test_strategy_recommend_prompt" label="测试策略推荐提示词">
          <ResetWrapper
            :originalValue="data?.system_config.test_strategy_recommend_prompt"
            v-model="formData.test_strategy_recommend_prompt"
          >
            <n-input
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 10,
              }"
              v-model:value="formData.test_strategy_recommend_prompt"
            />
          </ResetWrapper>
        </n-form-item>

        <n-form-item path="docx_rag_conform_prompt" label="需求符合性判断提示词">
          <ResetWrapper
            :originalValue="data?.system_config.docx_rag_conform_prompt"
            v-model="formData.docx_rag_conform_prompt"
          >
            <n-input
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 10,
              }"
              v-model:value="formData.docx_rag_conform_prompt"
            />
          </ResetWrapper>
        </n-form-item>
      </n-form>
    </div>
  </n-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getSystemConfig, setSystemConfig } from '@/services/apis2'
import { useMessage } from 'naive-ui'
import ResetWrapper from './components/ResetWrapper.vue'

defineOptions({
  name: 'SystemSettings',
})

const message = useMessage()
const loading = ref(false)
const formRef = ref(null)

const submitting = ref(null)
const data = ref(null)
const formData = ref({
  deduplicate_threshold: 0.9,
  failure_score_limit: 20,
  execute_score_limit: 20,
  recommend_use_llm: true,
  evaluate_smart_cockpit_prompt: '',
})

const rules = ref({})

const handleSubmit = async (actionText = '更新系统设置') => {
  submitting.value = true
  formRef.value.validate().then(() => {
    setSystemConfig(formData.value)
      .then((res) => {
        if (res?.status === 200) {
          message.success(`${actionText}成功`)
        }
      })
      .catch((error) => {
        message.error(`${actionText}失败:`, error)
      })
      .finally(() => {
        submitting.value = false
      })
  })
}

const handleReset = () => {
  formData.value = { ...data.value?.system_config }
  handleSubmit('恢复默认值')
}

const getSystemConfigData = async () => {
  loading.value = true

  const res = await getSystemConfig()

  data.value = res?.data || {}
  formData.value = {
    ...(data.value?.system_config || {}),
    ...(data.value?.user_config || {}),
  }
  loading.value = false
}

onMounted(() => {
  getSystemConfigData()
})
</script>

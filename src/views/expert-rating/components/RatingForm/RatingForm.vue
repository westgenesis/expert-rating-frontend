<!-- eslint-disable vue/no-mutating-props -->
<template>
  <n-form
    ref="formRef"
    :disabled="previewMode || disabled"
    :model="ratingMatrixFormData"
    :rules="rules"
  >
    <slot name="prefix"></slot>
    <n-form-item path="ratingData" class="-mt-8">
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
  </n-form>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  previewMode: {
    type: Boolean,
  },
  disabled: {
    type: Boolean,
  },
  ratingMatrixFormData: {
    type: Object,
    required: true,
  },
})

const formRef = ref(null)

const rules = {
  ratingData: {
    required: true,
    message: '请选择评分',
    validator: (rule, value) => {
      console.log(value)
      if (value.some((item) => item.value === '')) {
        return new Error('请选择评分')
      }
      return true
    },
  },
  remark: {
    required: true,
    message: '请输入备注',
    trigger: ['input', 'blur'],
  },
}

defineExpose({
  restoreValidation() {
    return formRef.value.restoreValidation()
  },
  validate() {
    return formRef.value.validate()
  },
})
</script>

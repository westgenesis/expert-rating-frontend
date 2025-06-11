<template>
  <n-button @click="visible = true">确认评价结果</n-button>
  <n-modal v-model:show="visible" title="确认评分" preset="dialog" size="medium">
    <div class="flex flex-col items-center justify-center">
      <n-alert class="w-full mb-6" title="警告提示" type="warning">
        确认评价结果后不可更改
      </n-alert>
      <n-space>
        <n-button type="primary" @click="handleSubmit">确认</n-button>
        <n-button @click="handleCancel">取消</n-button>
      </n-space>
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

const handleSubmit = () => {
  // TODO: 提交
  visible.value = false
}

const handleCancel = () => {
  visible.value = false
}
</script>

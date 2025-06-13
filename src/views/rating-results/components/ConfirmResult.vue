<template>
  <n-button @click="handleSubmit">确认评价结果</n-button>
  <n-modal v-model:show="visible" title="确认评分" preset="dialog" size="medium">
    <div class="flex flex-col items-center justify-center">
      <n-alert class="w-full mb-6" title="警告提示" type="warning">
        确认评价结果后不可更改
      </n-alert>
      <n-space>
        <n-button type="primary" @click="handleConfirmSubmit">确认</n-button>
        <n-button @click="handleCancel">取消</n-button>
      </n-space>
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import { getTapSubmitScores } from '@/services/apis'
import { useMessage } from 'naive-ui'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  status: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const visible = ref(false)
const message = useMessage()

const handleSubmit = () => {
  if (props.status) {
    message.warning('已确认评价结果，不可更改')
    return
  }
  visible.value = true
}

const handleConfirmSubmit = async () => {
  visible.value = false
  await getTapSubmitScores({
    name: props.name,
  })
    .then(() => {
      message.success('确认评分成功')
      emit('submit')
    })
    .catch((error) => {
      message.error(`确认评分失败:${error.response.data?.detail}`)
    })
}

const handleCancel = () => {
  visible.value = false
}
</script>

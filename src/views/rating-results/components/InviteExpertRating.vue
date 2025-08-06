<template>
  <n-button type="primary" @click="handleInvite">邀请专家评分</n-button>

  <n-drawer v-model:show="visible" :width="600" placement="right">
    <n-drawer-content closable title="选择评分专家">
      <div class="h-full flex flex-col">
        <n-checkbox
          v-model:checked="selectAll"
          :indeterminate="indeterminate"
          class="mb-6"
          @change="handleSelectAll"
          >全部</n-checkbox
        >

        <n-checkbox-group v-model:value="selectedExperts" class="flex-1 overflow-y-auto">
          <n-grid :y-gap="20" :x-gap="16" :cols="2">
            <n-gi
              v-for="item in expertList"
              :key="item.email"
              class="border border-gray-200 rounded-sm p-4"
            >
              <n-checkbox :value="item" class="!items-center">
                <div class="flex items-center gap-2">
                  <n-avatar round :size="large">
                    {{ item.name.slice(0, 1) }}
                  </n-avatar>
                  <div class="flex flex-col">
                    <div class="text-md font-bold">{{ item.name }}</div>
                    <div class="text-sm text-gray-400">邮箱：{{ item.email }}</div>
                  </div>
                </div>
              </n-checkbox>
            </n-gi>
          </n-grid>
        </n-checkbox-group>
      </div>

      <template #footer>
        <n-space>
          <n-button @click="visible = false">取消</n-button>
          <n-button
            type="primary"
            :loading="loading"
            :disabled="!selectedExperts.length || props.status"
            @click="handleInviteSubmit"
          >
            邀请
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { getTapExpertsEmail, postTapAskExpertsReview } from '@/services/apis'

const props = defineProps({
  dataId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit'])

const message = useMessage()

const expertList = ref()

const selectedExperts = ref([])

const visible = ref(false)

const loading = ref(false)

const selectAll = ref(false)

const getExpertList = async () => {
  const { data } = await getTapExpertsEmail()
  expertList.value = data
}

onMounted(() => {
  getExpertList()
})

watch(selectedExperts, () => {
  selectAll.value = selectedExperts.value.length === expertList.value.length
})

const indeterminate = computed(() => {
  return selectedExperts.value.length > 0 && selectedExperts.value.length < expertList.value.length
})

const handleSelectAll = () => {
  if (selectedExperts.value.length === expertList.value.length) {
    selectedExperts.value = []
    selectAll.value = false
  } else {
    selectedExperts.value = expertList.value
    selectAll.value = true
  }
}

const handleInvite = async () => {
  visible.value = true
}

const handleInviteSubmit = async () => {
  loading.value = true

  const { status } = await postTapAskExpertsReview({
    emails: selectedExperts.value.map((item) => item.email),
    testobject_id: props.dataId,
  })

  if (status === 200) {
    message.success('邀请专家评分成功')
    emit('submit')
  }

  loading.value = false
  visible.value = false
}
</script>

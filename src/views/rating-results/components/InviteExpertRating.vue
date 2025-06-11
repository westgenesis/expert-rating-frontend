<template>
  <n-button type="primary" @click="visible = true">邀请专家评分</n-button>

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
            :disabled="!selectedExperts.length"
            @click="handleInvite"
          >
            邀请
          </n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()

const expertList = ref([
  {
    name: '张老师',
    email: 'zhang@qq.com',
  },
  {
    name: '李老师',
    email: 'li@qq.com',
  },
  {
    name: '王老师',
    email: 'wang@qq.com',
  },
  {
    name: '赵老师',
    email: 'zhao@qq.com',
  },
  {
    name: '钱老师',
    email: 'qian@qq.com',
  },
  {
    name: '孙老师',
    email: 'sun@qq.com',
  },
])

const selectedExperts = ref([])

const visible = ref(false)

const loading = ref(false)

const selectAll = ref(false)

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

const handleInvite = () => {
  loading.value = true
  setTimeout(() => {
    message.success('邀请专家评分成功')
    loading.value = false
    visible.value = false
  }, 2000)
}
</script>

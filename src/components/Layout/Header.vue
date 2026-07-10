<template>
  <div class="flex items-center justify-between shadow-xs px-4 py-3 bg-slate-50">
    <h1 class="flex items-center text-lg font-semibold text-[#0054A7]">
      <n-icon size="24" color="#0054A7" class="mr-4" v-if="icon">
        <component :is="icon" />
      </n-icon>
      {{ title }}
    </h1>

    <TestObjSelect v-if="isAdmin" />

    <div class="flex flex-col items-center py-1" v-if="exportInfo">
      <n-avatar round size="small">
        {{ exportInfo?.name?.charAt(0) }}
      </n-avatar>
      <span class="text-sm text-gray-600">{{ exportInfo?.email }}</span>
    </div>
  </div>
</template>

<script setup>
import useExperInfo from '@/hooks/useExpertInfo'
import TestObjSelect from '../TestObjSelect.vue'

defineOptions({
  name: 'PageHeader',
})

import { useRoute } from 'vue-router'
import { computed } from 'vue'

const { exportInfo } = useExperInfo()

const route = useRoute()
const title = computed(() => {
  return route.meta.title || '默认标题'
})

const icon = computed(() => {
  return route.meta.icon || null
})

const isAdmin = computed(() => {
  return (
    !exportInfo?.value ||
    (exportInfo?.value?.name === '管理员' && exportInfo?.value?.email === 'admin@admin.com')
  )
})
</script>

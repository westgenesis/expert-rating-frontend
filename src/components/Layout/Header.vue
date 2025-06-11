<template>
  <div class="h-16 flex items-center justify-between shadow-xs px-4 bg-slate-50">
    <h1 class="flex items-center text-lg font-semibold text-[#0054A7]">
      <n-icon size="24" color="#0054A7" class="mr-4" v-if="icon">
        <component :is="icon" />
      </n-icon>
      {{ title }}
    </h1>
    <div class="flex flex-col gap-2 items-center" v-if="userInfo">
      <n-avatar round size="small">
        {{ userInfo?.name?.charAt(0) }}
      </n-avatar>

      <span class="text-sm text-gray-600">{{ userInfo?.email }}</span>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'PageHeader',
})

import { useRoute } from 'vue-router'
import { computed } from 'vue'
import useUser from '@/hooks/useUser'
import { NAvatar, NIcon } from 'naive-ui'

const { userInfo } = useUser()
const route = useRoute()
const title = computed(() => {
  return route.meta.title || '默认标题'
})

const icon = computed(() => {
  return route.meta.icon || null
})
</script>

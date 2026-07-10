<template>
  <div class="flex flex-col h-screen bg-white">
    <Header />

    <n-layout :has-sider="isAdmin">
      <SideBar v-if="isAdmin" />
      <Content />
    </n-layout>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import Header from './Header.vue'
import SideBar from './SideBar.vue'
import Content from './Content.vue'

import useExperInfo from '@/hooks/useExpertInfo'

defineOptions({
  name: 'PageLayout',
})

const { exportInfo } = useExperInfo()

const isAdmin = computed(() => {
  return exportInfo?.value?.name === '管理员' && exportInfo?.value?.email === 'admin@admin.com'
})
</script>

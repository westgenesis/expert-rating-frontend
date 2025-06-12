<template>
  <div class="flex flex-col h-screen bg-white">
    <Header />

    <n-layout :has-sider="!isHideMenu">
      <SideBar v-if="!isHideMenu" />
      <Content />
    </n-layout>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Header from './Header.vue'
import SideBar from './SideBar.vue'
import Content from './Content.vue'

defineOptions({
  name: 'PageLayout',
})

const route = useRoute()

const isHideMenu = computed(() => {
  return route.isHideMenu
})
</script>

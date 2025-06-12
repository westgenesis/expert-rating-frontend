<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-global-style />
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'

/**
   * js 文件下使用这个做类型提示
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const themeOverrides = {
    common: {
      primaryColor: '#0C53FD',
      primaryColorHover: '#0038FF',
      primaryColorPressed: '#0032E6',
      primaryColorSuppl: '#E0E8FF',
    },

  }
</script>

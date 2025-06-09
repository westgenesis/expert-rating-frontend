<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-global-style />
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <div class="flex-1 overflow-hidden p-4">
    <n-layout-content :native-scrollbar="false" class="h-full">
      <router-view />
    </n-layout-content>
  </div>
</template>

<script setup>
defineOptions({
  name: 'LayoutContent',
})
</script>

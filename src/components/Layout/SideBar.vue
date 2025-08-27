<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <n-menu
      v-model:value="activeKey"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </n-layout-sider>
</template>

<script setup>
import { h, ref, computed, watch } from 'vue'
import { routes } from '@/router/index'
import { RouterLink, useRoute } from 'vue-router'
import { NIcon } from 'naive-ui'

const collapsed = ref(false)

const route = useRoute()
const activeKey = ref(route.name)

watch(
  () => route.name,
  (newVal) => {
    activeKey.value = newVal
  },
)

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const getMenu = (routeItem) => {
  return {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: routeItem.name,
            query: route.query,
          },
        },
        { default: () => routeItem.meta.title },
      ),
    key: routeItem.name,
    icon: renderIcon(routeItem.meta.icon),
    children: routeItem.children
      ?.filter((child) => !child.hideInMenu)
      .map((child) => getMenu(child)),
  }
}

const menuOptions = computed(() => {
  return routes[0].children.filter((route) => !route.hideInMenu).map(getMenu)
})
</script>

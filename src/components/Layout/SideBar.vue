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
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </n-layout-sider>
</template>

<script setup>
import { h, ref, computed } from 'vue'
import { routes } from '@/router/index'
import { RouterLink } from 'vue-router'
import { NIcon } from 'naive-ui'

const collapsed = ref(false)

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const getMenu = (route) => {
  return {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: route.name,
          },
        },
        { default: () => route.meta.title },
      ),
    key: route.name,
    icon: renderIcon(route.meta.icon),
    children: route.children?.filter((child) => !child.hideInMenu).map((child) => getMenu(child)),
  }
}

const menuOptions = computed(() => {
  return routes[0].children.filter((route) => !route.hideInMenu).map(getMenu)
})
</script>

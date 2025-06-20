import { createRouter, createWebHistory } from 'vue-router'
import { StarReview, Settings } from '@vicons/carbon'
import useExperInfo from '@/hooks/useExpertInfo'
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/Layout/index.vue'),
    meta: { title: '专家评测系统' },
    redirect: '/settings',
    children: [
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/rating-settings/index.vue'),
        meta: { title: '设置', icon: Settings },
      },
      {
        path: 'expert-rating',
        name: 'expert-rating',
        component: () => import('../views/expert-rating/index.vue'),
        meta: { title: '专家评测', icon: StarReview },
        // hideInMenu: true,
        hideMenu: true,
      },
      {
        path: 'rating-results',
        name: 'rating-results',
        component: () => import('../views/rating-results/index.vue'),
        meta: { title: '评测结果', icon: StarReview },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 设置路由元信息，动态修改页面标题
router.beforeEach(async (to, from, next) => {
  // 如果路由有meta.title，则设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title
  }

  // 如果路由query中有token，则将其存储到localStorage
  if (to.query.token) {
    localStorage.clear() // 清空localStorage
    localStorage.setItem('token', to.query.token)
  }

  const { getExportInfo, exportInfo } = useExperInfo()
  if (!exportInfo.value) {
    await getExportInfo()
  }
  next()
})

export { routes }

export default router

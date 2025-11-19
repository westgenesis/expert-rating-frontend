# 一汽TPA平台 - 专家评分系统前端

## 项目概览

本项目为一汽TPA平台- 专家评分系统的前端部分。实现了评测系统相关功能，包括系统设置、专家评测、以及评测结果的展示。

## 技术栈

- 前端框架：Vue3
- 构建工具：Vite
- 样式 Tailwind CSS
- 组件库：NaiveUI
- 路由：Vue Router
- 数据可视化：ECharts 5 + Vue ECharts
- HTTP请求：Axios
- 工具库：date-fns、lodash、marked（Markdown 解析）
- 部署：Docker + nginx

## 前端架构

### 一、项目结构

``` 
.
├── deploy.sh               # 部署脚本，用于部署项目到服务器或打包环境
├── docker-compose.yml      # Docker Compose 配置文件，用于管理多容器服务
├── Dockerfile              # Docker 镜像构建文件
├── eslint.config.js        # ESLint 配置文件，用于代码风格和规范检查
├── index.html              # 项目入口 HTML 文件
├── jsconfig.json           # JS/TS 代码智能提示和路径别名配置
├── nginx.conf              # Nginx 配置文件，用于前端静态资源服务或代理
├── package-lock.json       # npm 依赖锁定文件
├── package.json            # 项目配置和依赖列表
├── public
│   └── favicon.ico         # 网站 favicon 图标
├── README.md               # 项目说明文档
├── src                     # 源代码目录
│   ├── App.vue             # Vue 根组件
│   ├── assets
│   │   └── logo.png        # 项目 logo 图片资源
│   ├── components          # Vue 组件目录
│   │   ├── BaseChart.vue        # 图表基础组件
│   │   ├── Layout              # 布局相关组件目录
│   │   ├── MarkdownPreview.vue # Markdown 预览组件
│   │   ├── PieChart.vue        # 饼图组件
│   │   ├── RenderHTML.vue      # 渲染 HTML 内容组件
│   │   └── TestObjSelect.vue   # 测试对象选择组件
│   ├── hooks               # Vue Composition API hooks
│   │   ├── useExpertInfo.js    # 获取专家信息的自定义 Hook
│   │   └── useRatingObj.js     # 获取评分对象的自定义 Hook
│   ├── main.js             # Vue 应用入口 JS 文件
│   ├── router
│   │   └── index.js        # Vue Router 路由配置
│   ├── services            # 接口请求相关
│   │   ├── apis.js         # API 接口封装
│   │   └── http.js         # HTTP 请求工具（axios 封装）
│   ├── styles
│   │   └── main.css        # 全局样式
│   └── views               # 页面视图目录
│       ├── expert-rating       # 专家评分页面
│       ├── rating-results      # 评分结果页面
│       └── rating-settings     # 评分设置页面
└── vite.config.js          # Vite 构建配置文件
```

### 二、路由模块 (src/router/index.js)

- 三个主要路由：设置、专家评测、评测结果
- 支持路由 query 参数传递（data_id、token）
- 自动管理页面标题和 Token

### 三、服务层 (src/services/apis.js)

- 统一管理所有后端 API 调用
- 支持专家矩阵、评分历史、测试用例等数据获取

### 四、状态管理 (src/hooks/)

- `useRatingObj`：管理评分对象信息
- `useExpertInfo`：管理专家用户信息

### 五、页面模块

- **评分设置**：配置系数、评分矩阵、专家列表
- **专家评分**：查看测试结果、提交评分
- **评分结果**：展示评分数据、邀请专家、确认结果

## 前端路由

项目的路由配置位于`src/router/index.js`，采用 **Vue Router 4** 实现。

```js
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
```



```
/                          (主布局)
├── /settings              (设置页面)
├── /expert-rating         (专家评分页面)
└── /rating-results        (评分结果页面)
```

### 权限相关

通过Vue Router的路由守卫获取url中的`query.token`来实现用户鉴权。获取到token后后续所有请求都将携带token作为请求头发送以进行权限和用户识别。

核心代码：

```js
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
```

```js
// 配置请求拦截器，可用于添加认证令牌等
api.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Token = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
```

## 开发

### 项目环境
安装[volta](https://docs.volta.sh/guide/getting-started)
用于管理node和npm版本
```bash
curl https://get.volta.sh | bash
```

默认cd进入项目后会自动安装项目node依赖。

### 启动项目
```bash
npm install
npm run dev
```

### 打包项目
```bash
npm run build
```

## 部署

在需要部署的服务器上配置好git，然后拉取本项目的代码后，执行：

```bash
$ sh ./deploy.sh
```

此脚本将会自动拉取最新代码，并构建启动docker

## 访问

随后可通过：http://[服务器ip]:[8099] 访问


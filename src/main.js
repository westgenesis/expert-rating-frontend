import './styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

// 关于 tailwind 的 preflight 样式 https://www.naiveui.com/zh-CN/os-theme/docs/style-conflict#About-Tailwind's-Preflight-Style-Override
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

app.mount('#app')

# expert-rating-frontend

一汽TPA平台 - 专家评分系统前端

## 项目基础框架
使用vue3+vite+NaiveUI

## 项目环境
安装[volta](https://docs.volta.sh/guide/getting-started)
用于管理node和npm版本
```bash
curl https://get.volta.sh | bash
```

默认cd进入项目后会自动安装项目node依赖。

## 启动项目
```bash
npm install
npm run dev
```

## 打包项目
```bash
npm run build
```

## 项目部署
使用docker-compose部署
```bash
docker-compose up -d
```

## 项目代理

### 开发环境 
本地开发环境使用vite进行开发环境代理，配置在vite.config.js中，使用`VITE_API_SERVER_URL`环境变量进行配置。

### 生产环境
生产环境使用nginx做反向代理，配置在nginx.conf中，反向代理到8099端口。
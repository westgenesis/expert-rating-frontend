# ========== 构建阶段 ==========
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 拷贝依赖文件并安装依赖
COPY package*.json ./
RUN npm install --frozen-lockfile

# 拷贝源码并构建
COPY . .
RUN npm run build

# ========== 运行阶段 ==========
FROM nginx:alpine

# 删除默认 nginx 静态资源
RUN rm -rf /usr/share/nginx/html/*

# 拷贝构建产物到 nginx 目录
COPY --from=build /app/dist /usr/share/nginx/html

# nginx 配置模板：容器启动时官方镜像入口脚本会用 envsubst 渲染到 /etc/nginx/conf.d/default.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# 只替换 API_ 开头的变量，避免误替换 $host 等 nginx 内置变量
ENV NGINX_ENVSUBST_FILTER=^API_

# 暴露端口（默认80）
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
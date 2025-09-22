# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 安装所有依赖
RUN npm ci

# 复制项目源代码
COPY . .

# 构建项目
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物到nginx服务器
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
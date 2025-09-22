FROM  registry.cn-shanghai.aliyuncs.com/huangzhenyu_2532/nginx:latest

COPY ./dist/  /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

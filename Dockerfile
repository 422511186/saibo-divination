FROM nginx:1.25-alpine


COPY ./dist/  /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80

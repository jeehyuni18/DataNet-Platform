FROM nginx:1.13.9-alpine

EXPOSE 80

RUN rm -rf /etc/nginx/conf.d
COPY ./conf /etc/nginx
COPY ./build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

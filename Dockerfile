
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
  
ADD default.conf /etc/nginx/conf.d/

COPY --from=builder /click-cat/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


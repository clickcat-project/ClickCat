
FROM nginx:alpine

RUN install -g typescript
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

RUN rm /etc/nginx/conf.d/default.conf
  
ADD default.conf /etc/nginx/conf.d/

COPY /click-cat/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


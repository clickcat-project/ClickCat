FROM node:lts-alpine as builder

# env set
ENV EVA_ENTRYPOINT=/api
ENV MACHINELEARNING_URL=http://172.16.1.192:8080/
ENV PORT=80

WORKDIR /
COPY package.json /
RUN npm install -g pnpm

RUN pnpm install

COPY / /

RUN pnpm build

FROM nginx:alpine

# RUN rm /etc/nginx/conf.d/default.conf
  
ADD nginx.template /etc/nginx/conf.d/

# COPY ./main.sh /

COPY --from=builder /click-cat/ /usr/share/nginx/html/

# 容器内给shell文件添加所有用户可执行权限
# RUN chmod a+x ./main.sh

EXPOSE 80

WORKDIR /etc/nginx/conf.d

ENTRYPOINT envsubst '$MACHINELEARNING_URL'  < nginx.template > default.conf && cat default.conf && nginx -g 'daemon off;'


# CMD ["sh", "main.sh"]
#CMD ["nginx", "-g", "daemon off;"]
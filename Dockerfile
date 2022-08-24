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

RUN rm /etc/nginx/conf.d/default.conf
  
ADD default.conf /etc/nginx/conf.d/

COPY --from=builder /click-cat/ /usr/share/nginx/html/

EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]
CMD ["sh", "main.sh"]
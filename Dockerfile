FROM node:16-slim
ADD . /app

WORKDIR /app

RUN echo 'nodeLinker: node-modules' > .yarnrc.yml
RUN yarn set version 3.1.1
RUN yarn install 

EXPOSE 9001 
    
CMD ["yarn", "start"]

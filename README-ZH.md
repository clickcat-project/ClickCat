# 发布
```bash
pnpm build:updateVersion x.x.x 
```
    - 通过 update.sh 脚本修改 package.json 版本号、提交tag，然后触发 git-action 进行发布
    - git-action 通过触发一系列的 docker 的动作进行打包并发布到 dockerhub ，然后在服务器拉取上传的包并使用 docker 启动

# 如果你想直接访问 docker 镜像，请执以下命令
```bash
docker pull clickcat/clickcat
docker run -d -e MACHINELEARNING_URL=http://8.135.49.240:8081/ -e PORT=5555 -p 9090:5555 --name clickcat clickcat/clickcat
```
    - PORT 配置 docker 启动端口
    - -p 配置本地端口对 PORT 的映射
    - --name 配置容器名称

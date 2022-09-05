# 发布
```bash
pnpm build:updateVersion x.x.x 
```
    - 通过 update.sh 脚本修改 package.json 版本号、提交tag，然后触发 git-action 进行发布
    - git-action 通过触发一系列的 docker 的动作进行打包并发布到 dockerhub ，然后在服务器拉取上传的包并使用 docker 启动
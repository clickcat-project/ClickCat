# /bin/bash

# 设置多个环境变量到 environment variable
echo -e "set \$MACHINELEARNING_URL $MACHINELEARNING_URL;
set \$PORT $PORT;" > /etc/nginx/conf.d/env.variable; 

# 设置单个环境变量到 environment variable
# echo set \$MACHINELEARNING_URL $MACHINELEARNING_URL\; > /etc/nginx/conf.d/env.variable 
# 启动 nginx 应用
nginx
# 防止容器启动后进程退出，导致容器退出；实现容器后台运行
sh
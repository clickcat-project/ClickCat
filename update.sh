#!/bin/bash

version=$1

error () {
  echo ""
  echo "🚫 ERROR: $@";
}

info () {
  echo ""
  echo "💬 INFO: $@";
}

local_package_json="package.json"
local_version=$(cat $local_package_json \
    | grep version \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[",]//g' \
    | tr -d '[[:space:]]')

info "当前版本：$local_version"

new_version=local_version

read -p "请输入船新版本号：" new_version

if [ "$new_version" == "" ]; then
  error "请输入版本号"
  exit 1
fi

info "船新版本：$new_version"

# 以下一行代码中 [[ -z $(git status -s) ]] 也可以哟并来检测是否有未提交的代码
# [[ -z $(git status -s) ]] || { error '请先 stash 或 commit 你当前的改动.'; exit 1; }

# 以下两行代码应该都可以单独作为检测是否有未提交代码的检测方法，但是没有测试过
# git diff --quiet && git diff --cached --quiet
# git diff --quiet HEAD

# 检测是否有未提交的代码
if [ -z "${SKIP_PRECHECK}" ]; then
    # Step 0: check for uncommitted changes
    git status
    git diff-index --quiet HEAD -- || { error '请先 stash 或 commit 你当前的改动.'; exit 1; }

    # Step 1: push current branch to remote
    # info '正在将当前分支同步.'
    # git push || exit 1
fi

# 通过 npm version 来修改 package.json 的版本号，并打出对应的 版本tag
npm version "$new_version"
info "修改版本完成"

# 修改完成版本号后提交 package.json
git add package.json
git commit -m "feat: change package version"
git push
info "提交 package 版本修改"

# 提交tag
git push origin "v$new_version"
info "提交 tag ，执行 git-action"
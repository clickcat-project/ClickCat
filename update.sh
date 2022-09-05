#!/bin/bash

version=$1

error () {
  echo ""
  echo "🚫 ERROR: $@";
}

echo "当前版本：$version"

# [[ -z $(git status -s) ]] || { error '请先 stash 或 commit 你当前的改动.'; exit 1; }

if [ -z "${SKIP_PRECHECK}" ]; then
    # Step 0: check for uncommitted changes
    git status
    git diff-index --quiet HEAD -- || { error '请先 stash 或 commit 你当前的改动.'; exit 1; }

    # Step 1: push current branch to remote
    info '正在将当前分支同步至 GitLab.'
    git push || exit 1
fi

# 通过 npm version 来修改 package.json 的版本号，并打出对应的 版本tag
npm version "$version"
echo "修改版本完成"

# 修改完成版本号后提交 package.json
git add package.json
git commit -m "feat: change package version"
git push
echo "提交 package 版本修改"

# 提交tag
git push origin "$version"
echo "提交 tag ，执行 git-action"
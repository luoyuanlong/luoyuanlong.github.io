---
type: ops
number: "001"
date: 2026-03-14
title: 渊默雷声博客搭建与双端部署配置
tags: [blog, next.js, cnb, github-pages, cloudflare]
related: []
---

# ops/001 渊默雷声博客搭建与双端部署配置

## 执行概述

- 时间：2026-03-14
- 执行人：qujingcc
- 环境：CNB（cnb.cool/qujingcc/blog）+ GitHub（luoyuanlong/luoyuanlong.github.io）

## 步骤一：技术选型

| 项目 | 选择 | 说明 |
|------|------|------|
| 框架 | Next.js 15（静态导出） | `output: "export"`，生成 `out/` |
| 样式 | Tailwind CSS v4 | `@tailwindcss/postcss` |
| 内容 | Markdown + gray-matter + remark | 文章放 `content/posts/` |
| 字体 | Noto Serif SC | CSS CDN 加载（fonts.loli.net），避免构建时访问 Google |
| 风格 | Paul Graham 极简早期网页风 | 中文，宋体衬线，最大宽 680px |

## 步骤二：CNB + EdgeOne Pages 部署

`.cnb.yml` 配置：
```yaml
main:
  push:
    - imports: https://cnb.cool/qujingcc/secrets/-/blob/main/envs.yml
      stages:
        - name: Build
          image: oven/bun:latest
          script: |
            bun install
            NEXT_TELEMETRY_DISABLED=1 bun run build
        - name: Deploy to EdgeOne Pages
          image: node:20
          script: npx edgeone pages deploy ./out -n qujingcc-blog -t $EDGEONE_API_TOKEN
```

密钥存放：CNB 特殊 `secrets` 仓库（`cnb.cool/qujingcc/secrets`），`envs.yml` 中存 `EDGEONE_API_TOKEN` 和 `GITHUB_TOKEN`。

## 步骤三：GitHub Pages 部署

`.github/workflows/deploy.yml`：Bun 构建 + `peaceiris/actions-gh-pages@v4` 推送到 `gh-pages` 分支。

GitHub 仓库设置：Branch = `gh-pages`，Custom domain = `luoyuanlong.com`。

## 步骤四：CNB → GitHub 自动同步

在 `.cnb.yml` 追加第二个 push 任务：

```yaml
    - name: sync-github
      docker:
        image: alpine/git
      imports:
        - https://cnb.cool/qujingcc/secrets/-/blob/main/envs.yml
      stages:
        - name: 同步到 GitHub
          script: |
            git remote add github https://x-access-token:${GITHUB_TOKEN}@github.com/luoyuanlong/luoyuanlong.github.io.git
            git push github HEAD:main --force
            echo "✓ 已同步到 GitHub"
```

每次 push 到 CNB，两个任务并行：EdgeOne 部署 + 同步触发 GitHub Actions。

## 步骤五：自定义域名 luoyuanlong.com

1. 腾讯云域名注册，DNS 迁移至 Cloudflare（免费版，无负载均衡条数限制）
2. Cloudflare 添加两条 CNAME（DNS only，灰色云朵）：
   ```
   @   → luoyuanlong.github.io
   www → luoyuanlong.github.io
   ```
3. GitHub Pages 设置 Custom domain，勾选 Enforce HTTPS
4. `.github/workflows/deploy.yml` 加 `cname: luoyuanlong.com`，防止每次部署覆盖 CNAME 文件

## 坑记录

### gray-matter 将 YAML 日期解析为 Date 对象
- **现象**：`post.date.split is not a function`
- **原因**：gray-matter 自动将 `date: 2024-01-01` 解析为 JS Date 对象
- **修复**：`lib/posts.ts` 加 `toDateString()` 判断类型转换

### next/font/google 在 CNB CI 超时
- **现象**：构建挂起超过 10 分钟
- **原因**：CNB 容器访问 Google Fonts 被阻断
- **修复**：移除 `next/font/google`，改用 CSS `@import` 从 `fonts.loli.net` 加载

### CNB git push 被 pre-receive hook 拒绝
- **现象**：`remote: error: commit email not registered`
- **原因**：本地 git config 邮箱未在 CNB 注册
- **修复**：通过 CNB API 查到正确邮箱 `qujing@huoshuiai.com`，`git commit --amend --reset-author`

### Cloudflare 代理导致 GitHub HTTPS 无法签发
- **现象**：GitHub Pages 提示"domain is not properly configured to support HTTPS"
- **原因**：Cloudflare 橙色云朵（代理模式）遮蔽了真实 DNS，GitHub 无法验证
- **修复**：将两条 CNAME 改为灰色云朵（DNS only）

---
type: ops
number: "002"
date: 2026-03-14
title: 博客栏目、配色与图标升级
tags: [blog, next.js, theme, icon, cc]
related: ["ops/001"]
---

# ops/002 博客栏目、配色与图标升级

## 执行概述

- 时间：2026-03-14
- 执行人：qujingcc
- 环境：本地开发 + CNB 自动同步

## 步骤一：栏目结构调整

| 原结构 | 新结构 | 说明 |
|--------|--------|------|
| 文章 | 随笔 | 个人思考、练笔 |
| — | CC | Claude Code 相关教程 |
| — | 摘录 | 书摘、语录 |
| 关于 | 关于 | 保持不变 |

**路由变更**：
- `/` → 随笔列表
- `/essays/[date]/` → 随笔详情（原 `/e/[slug]/`）
- `/cc/` → CC 列表
- `/cc/[date]/` → CC 详情
- `/quotes/` → 摘录页
- `/about/` → 关于页

**代码变更**：
- 新建 `lib/cc.ts`（复用 `lib/posts.ts` 逻辑）
- 新建 `app/cc/` 和 `app/essays/` 路由
- 更新 `app/layout.tsx` 导航链接

## 步骤二：文章 metadata 扩展

**Frontmatter 新增字段**：
- `author`（可选）：作者署名（渊隆 / CC）
- `summary`（可选）：简短摘要，风格为「金句 + 概括」

**文章 header 布局**：
```
标题
摘要（如有）
作者 · 日期
```

**代码变更**：
- `lib/posts.ts` 和 `lib/cc.ts` 增加 `author`、`summary` 字段
- `app/essays/[date]/page.tsx` 和 `app/cc/[date]/page.tsx` 渲染新 header

## 步骤三：配色升级（宣纸暖色系）

| 元素 | 旧值 | 新值 | 说明 |
|------|------|------|------|
| 背景 | `#fff` | `#f8f4ee` | 宣纸暖白 |
| 正文 | `#1a1a1a` | `#1a1714` | 暖墨 |
| 导航/辅助 | `#888` | `#7c746c` | 暖灰 |
| Footer | `#bbb` | `#b5ada4` | 暖灰 |
| 引用边线 | `#ddd` | `#d4cabf` | 暖褐 |
| 引用文字 | `#666` | `#5c554e` | 暖褐 |
| 代码背景 | `#f5f5f5` | `#ede8e0` | 暖沙 |
| 分割线 | `#eee` | `#e0d8ce` | 暖灰 |
| 选中背景 | 浏览器默认 | `#e2d9cd` | 暖沙 |

**代码变更**：`app/globals.css` + `app/layout.tsx` 颜色变量更新

## 步骤四：抽象图标设计

**设计理念**：结合「渊」（深水/静谧）和「雷声」（闪电/声波）的抽象笔划。

**方案 B「势」**：单笔对角笔划，宽头在左下，细尖在右上，黑底米白（`#1a1a1a` / `#f0ebe0`），圆角矩形背景。

**文件**：`app/icon.svg`（Next.js 自动识别为 favicon）

## 步骤五：初始内容填充

**CC 栏目首篇文章**：
- `content/cc/macos-multi-version-cli.md`
- 标题：macOS 多版本命令行工具管理指南
- 作者：CC
- 摘要："PATH 从左到右查找，找到第一个就停止。同一工具在 macOS 上可能有多处安装，用 where、file、which 三步识别类型、确认优先级，清理多余版本。"

**摘录栏目**：`data/quotes.ts` 预置 5 条书摘语录

## 步骤六：变更记录体系建立

创建 `docs/changes/` 目录，结构：
```
docs/changes/
  README.md
  ops/001_blog-setup-deploy-domain.md
  ops/002_blog-features-theme-icon.md
docs/README.md
```

**目的**：记录重要操作、架构决策、故障复盘，便于 AI 快速理解项目上下文。

## 坑记录

### 文件路径重构
**问题**：原文章路由 `/e/[slug]/` 改为 `/essays/[date]/`，需同时更新 `lib/posts.ts` 的 `getPostByDate` 逻辑和路由文件。

**解决方案**：
- 保留 `lib/posts.ts` 的 `getAllPosts` 返回 `dateSlug`
- 新建 `app/essays/[date]/page.tsx` 匹配新路由
- 删除旧 `app/e/` 目录

### 配色一致性
**问题**：`app/layout.tsx` 中的导航和 footer 颜色未随 `globals.css` 更新。

**解决方案**：同步修改 `color` 和 `borderTop` 颜色值，保持视觉统一。

## 后续 TODO

- [ ] 添加 RSS 订阅（`/feed.xml`）
- [ ] 添加文章按年份/标签归档页
- [ ] 优化移动端响应式细节
- [ ] 考虑暗色模式切换

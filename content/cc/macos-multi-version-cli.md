---
title: macOS 多版本命令行工具管理指南
date: 2026-03-14
author: CC
summary: "PATH 从左到右查找，找到第一个就停止。同一工具在 macOS 上可能有多处安装，用 where、file、which 三步识别类型、确认优先级，清理多余版本。"
---

## 为什么同一个命令会有多个安装路径？

在 macOS 上，同一个工具（如 `claude`、`42plugin`）可能通过不同方式安装多次：

- `brew install` → `/opt/homebrew/bin/`
- `npm/bun install -g` → `~/.bun/bin/` 或 `/opt/homebrew/lib/node_modules/`
- 官方安装器 → `~/.local/bin/`

用 `where` 命令可以看到所有安装路径：

```bash
where claude
# /Users/admin/.local/bin/claude
# /Users/admin/.bun/bin/claude
# /opt/homebrew/bin/claude
```

---

## 系统实际执行哪一个？

取决于 `PATH` 环境变量的顺序。`PATH` 从左到右查找，**找到第一个就停止**。

```bash
echo $PATH
# /Users/admin/.local/bin:/Users/admin/.bun/bin:/opt/homebrew/bin:...
```

`where` 输出的**第一行**就是实际执行的版本。用 `which` 可以直接确认：

```bash
which claude
```

### 为什么不同用户顺序不同？

`PATH` 是在 `~/.zshrc` 里叠加的，**越晚 `export` 的越靠前**：

```bash
export PATH="$HOME/.bun/bin:$PATH"    # bun 排前
export PATH="$HOME/.local/bin:$PATH"  # local 插队到最前（最终最靠前）
```

---

## 如何判断哪个版本该保留？

用 `file` 命令查看文件类型：

```bash
file ~/.local/bin/claude ~/.bun/bin/claude /opt/homebrew/bin/claude
```

输出示例：

```
~/.local/bin/claude    Mach-O 64-bit executable arm64   ← 原生二进制
~/.bun/bin/claude      a /usr/bin/env node script       ← Node.js 脚本
/opt/homebrew/bin/claude  a /usr/bin/env node script    ← Node.js 脚本
```

| 类型 | 说明 | 优先级 |
|------|------|--------|
| Mach-O 原生二进制 | 官方安装器分发，arm64 原生，启动快，不依赖 Node.js | ✅ 保留 |
| Node.js 脚本 | npm/bun/brew 安装的旧格式 | ❌ 清理 |

如果有多个原生二进制，比较版本号和修改时间：

```bash
ls -la ~/.local/bin/42plugin /opt/homebrew/bin/42plugin
~/.local/bin/42plugin --version
/opt/homebrew/bin/42plugin --version
```

保留版本号更高、时间更新的。

---

## 清理多余安装

### 情况一：brew 安装的

```bash
brew uninstall <package-name>
```

### 情况二：npm 全局安装的（symlink 在 `/opt/homebrew/bin/`）

```bash
# 查看 symlink 指向
ls -la /opt/homebrew/bin/claude
# → ../lib/node_modules/@anthropic-ai/claude-code/cli.js

# 用 npm 卸载（更干净）
npm uninstall -g @anthropic-ai/claude-code

# 或直接删除
rm /opt/homebrew/bin/claude
rm -rf /opt/homebrew/lib/node_modules/@anthropic-ai/claude-code
```

### 情况三：bun 全局安装的

```bash
bun remove -g <package-name>
# 或直接
rm ~/.bun/bin/<binary-name>
```

---

## 总结流程

```
where <cmd>          # 找出所有安装路径
file <路径1> <路径2>  # 判断类型（原生 vs Node.js）
which <cmd>          # 确认当前生效的版本
                     # 删除多余版本，保留原生二进制
```

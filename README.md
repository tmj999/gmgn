# GMGN.AI（GitHub 托管版）快速复刻

> 目的：在 24 小时内复刻 GMGN.AI 的移动端 Web 体验（UI + 关键交互），并用 mock/简易后端跑通核心流程：登录/注册、钱包总览、复制交易、市场数据展示。

## 目录

- [功能范围](#功能范围)
- [本地运行](#本地运行)
- [环境变量](#环境变量)
- [GitHub Pages 部署（前端）](#github-pages-部署前端)
- [AI 工具说明](#ai-工具说明)
- [UX 流程文档](#ux-流程文档)

## 功能范围

已实现（以演示闭环为目标）：

- **登录/注册**：邮箱+密码，JWT。
- **钱包总览**：SOL 余额、positions（持仓）与 trades（历史成交）。
- **复制交易（Copy Trading）**：跟单配置持久化；交易发生时自动复制成交；禁止双方互相跟单。
- **市场数据展示（Mock）**：Token 列表/详情、K 线（mock OHLCV）。

## 本地运行

### 前端（gmgn）

```bash
cd gmgn
npm i
npm run dev
```

- 默认端口：`http://localhost:8080`

### 后端（gmgn-server）

```bash
cd gmgn-server
npm i
npm run dev
```

- 默认端口：`http://localhost:3001`
- 数据持久化：`gmgn-server/data/users.json`

## 环境变量

前端（Vite）：

- `VITE_API_BASE_URL`：后端 API Base URL（默认 `http://localhost:3001`）。

后端（gmgn-server）：

- `PORT`（默认 `3001`）
- `CORS_ORIGIN`（默认 `*`）
- `JWT_SECRET`（建议自行设置）
- `USERS_FILE`（可选，默认 `data/users.json`）

## GitHub Pages 部署（前端）

> 说明：GitHub Pages 只托管静态前端。后端 `gmgn-server` 需要单独部署到可公网访问的环境（或改为纯 mock）。

### 方式 A：构建时指定 base（推荐，零改动）

在 GitHub Actions 或本地构建时使用：

```bash
cd gmgn
npm ci
npm run build -- --base=/<YOUR_REPO_NAME>/
```

把 `dist/` 发布到 `gh-pages`（或 Pages artifact）。

### 方式 B：在 Vite 配置里写死 base

编辑 `gmgn/vite.config.ts`，增加：

```ts
export default defineConfig(() => ({
	base: "/<YOUR_REPO_NAME>/",
	// ...
}))
```

然后执行：

```bash
cd gmgn
npm run build
```

### 部署后端（可选但推荐）

- 将 `gmgn-server` 部署到任意 Node.js 托管平台（Render/Fly.io/VPS 等）。
- 在 GitHub Pages 环境为前端设置 `VITE_API_BASE_URL` 指向你的后端域名。

## AI 工具说明

本仓库在实现过程中使用了 AI 辅助开发（包括但不限于）：

- **GitHub Copilot（GPT-5.2）**：用于生成/修改 React + TypeScript 代码、API 路由、以及调试与重构建议。
- **Lovable（项目脚手架/生成器）**：用于初始化与生成 UI 代码基础结构（见依赖与 lovable-tagger）。

## UX 流程文档

- 见 [docs/ux-flow.md](docs/ux-flow.md)


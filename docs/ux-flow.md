# GMGN.AI（GitHub 托管版）UX 流程文档

> 目标：复刻 GMGN.AI 的移动 Web/Android 端交互主链路，并给出可执行的 UX 流程说明。
>
> 说明：本项目为“模拟撮合 + 本地 JSON 持久化”的演示实现，用于验证 UI/交互与状态流转。

## 1. 范围与角色

- **用户（User）**：可注册/登录、查看钱包、查看 token、下单交易、设置跟单。
- **交易员（Trader）**：与用户同源（任何登录用户都可能出现在榜单中）。
- **系统（System）**：提供 mock 市场数据（Token 列表/详情、K 线），并在交易发生时复制成交给跟随者。

## 2. 用户旅程图（从进入到完成一次复制交易）

### 2.1 Journey Map（高层）

| 阶段 | 触点/页面 | 用户目标 | 系统反馈 | 关键痛点/风险 | 成功指标 |
|---|---|---|---|---|---|
| 进入 | Trenches/Trending | 浏览市场 & 发现标的 | 列表展示、可点击进入详情 | 数据来源是 mock/占位 | 进入详情的点击率 |
| 登录 | Auth | 取得可交易/可跟单身份 | 登录成功后自动拉取 /me | token 失效、表单错误 | 登录成功率 |
| 发现交易员 | CopyTrade | 找到值得跟单的交易员 | 排行榜、点击进 TraderProfile | 自己不应出现在榜单里 | 进入 TraderProfile |
| 配置跟单 | CopyTradeDrawer | 设置买入规则与卖出策略 | Confirm 持久化策略 | 不支持策略需禁用 | 跟单配置成功率 |
| 验证跟单 | TraderProfile | 确认已跟单 & 查看策略摘要 | 显示“已跟单 + 策略摘要 + 取消” | 双向跟单需禁止 | Unfollow 可用 |
| 触发成交 | TokenDetail → Buy/Sell | 让交易员/自己产生一次成交 | 交易记录写入 + 余额更新 + 复制成交 | 死循环复制、余额不足 | trades 列表出现新记录 |
| 回看结果 | TokenDetail / Portfolio | 查看 token 的成交流与自己的资产变化 | token trades feed & portfolio 持仓/历史 | 价格/估值是占位 | 用户能对上数 |

### 2.2 关键链路（Mermaid）

```mermaid
flowchart TD
  A[进入应用] --> B[浏览 Trenches/Trending]
  B --> C{已登录?}
  C -- 否 --> D[Auth 登录/注册]
  D --> E[回到首页并拉取 /api/auth/me]
  C -- 是 --> F[CopyTrade 榜单]
  E --> F
  F --> G[进入 TraderProfile]
  G --> H[打开 CopyTradeDrawer]
  H --> I[选择 Buy Mode + Amount + Sell Method]
  I --> J[Confirm → POST /api/copytrade/follow]
  J --> K[TraderProfile 显示已跟单/策略摘要]
  K --> L[某次交易发生：POST /api/trade/buy|sell]
  L --> M[系统复制成交给 follower（写入 trades）]
  M --> N[TokenDetail Trades → GET /api/trade/token-history]
  N --> O[Portfolio → positions/trades（来自 /api/auth/me）]
```

## 3. 核心页面线框图（Wireframes）

> 说明：线框图用于标注关键交互元素（不追求视觉像素级）。

### 3.1 Auth（登录/注册）

```
+------------------------------------------------+
|  GMGN  (Auth)                                  |
|------------------------------------------------|
|  [ Email input ]                               |
|  [ Password input ]                            |
|                                                |
|  ( Login )   ( Switch to Signup )              |
|                                                |
|  错误提示区（如：无效账号/密码）                 |
+------------------------------------------------+
```

关键交互：
- 输入邮箱/密码 → 登录/注册。
- 成功后保存 token，并调用 `/api/auth/me` 获取用户信息。

### 3.2 CopyTrade（榜单） → TraderProfile（详情）

```
+------------------------------------------------+
| CopyTrade                                      |
|------------------------------------------------|
|  Rank | Trader | SOL Balance | ...             |
|  1    |  id... |   123.45    |  >             |
|  2    |  id... |    80.10    |  >             |
+------------------------------------------------+

点击一行 → 进入 TraderProfile

+------------------------------------------------+
| TraderProfile                                  |
|------------------------------------------------|
|  Avatar  DisplayName   SOL: xxx                |
|  [ Copy Trade ]  或 [ 已跟单(策略摘要) ][取消]   |
|------------------------------------------------|
|  Tabs: Wallet | Track | ...                    |
|  Wallet: positions 列表                         |
|  Track: trades 列表（最近 50）                   |
+------------------------------------------------+
```

关键交互：
- 点击榜单行 → `/trader/:id`。
- TraderProfile 顶部按钮：
  - 未跟单：打开 CopyTradeDrawer。
  - 已跟单：展示策略摘要，并提供 Unfollow。

### 3.3 CopyTradeDrawer（跟单设置）

```
+------------------------------------------+
| CopyTrade Drawer                          |
|------------------------------------------|
| Copy From: [ traderId ]                   |
| 7D PnL / WinRate / LastTime               |
|------------------------------------------|
| Buy Mode: [Max Buy] [Fixed Buy] [Ratio]   |
| Amount: [ input ]  (SOL / x)              |
| Presets: [10] [25] [50] [100]             |
|------------------------------------------|
| Sell Method: [Copy Sell] [Not Sell] [...] |
|  (TP&SL / Adv Strategy 禁用)              |
|------------------------------------------|
| [ Confirm ]                               |
| 错误提示区（如：禁止双方互相跟单）          |
+------------------------------------------+
```

关键交互：
- Confirm → `POST /api/copytrade/follow`（持久化 buyMode/sellMethod 等策略字段）。
- 若后端返回 `BIDIRECTIONAL_FOLLOW_NOT_ALLOWED`，前端显示友好文案提示。

### 3.4 TokenDetail（交易与 token trades feed）

```
+------------------------------------------------+
| TokenDetail                                    |
|------------------------------------------------|
| Token Info + Kline                              |
|------------------------------------------------|
| Trades Tab（token 维度成交流）                  |
| Age | Buy/Sell | Amount | Total | Trader        |
| ...                                              |
|------------------------------------------------|
| Bottom: [Buy]   [Sell]                          |
+------------------------------------------------+

Buy/Sell 打开 TradeDrawer → 调用 /api/trade/buy|sell
Trades 列表：GET /api/trade/token-history?tokenAddress=...
```

关键交互：
- Buy/Sell：打开抽屉并提交交易。
- trades：展示“该 token 的全站 trades”（包含 copy-trade 复制成交）。

### 3.5 Portfolio（我的持仓与历史）

```
+------------------------------------------------+
| Portfolio                                      |
|------------------------------------------------|
| Wallet summary (SOL)                            |
|------------------------------------------------|
| Tabs: Holding | History | Orders                |
|------------------------------------------------|
| Holding: positions 列表                          |
| History: 我的 trades 列表（来自 /api/auth/me）   |
+------------------------------------------------+
```

关键交互：
- Holding/History 切换。
- 数据来自 `/api/auth/me`（返回 wallets/positions/trades）。

## 4. 交互流程说明（可直接对照实现）

### 4.1 登录/注册流程
1. 用户进入 `/auth`。
2. 输入邮箱/密码。
3. 点击登录/注册：
   - 调用 `POST /api/auth/login` 或 `POST /api/auth/signup`。
   - 成功：保存 token；触发 `GET /api/auth/me` 刷新登录态。
4. 页面回到主界面（Trenches 等）。

### 4.2 跟单配置流程（一次成功跟单）
1. 用户进入 CopyTrade 榜单。
2. 点击某交易员 → 进入 TraderProfile。
3. 点击 “Copy Trade” 打开 CopyTradeDrawer。
4. 设置：
   - Buy Mode（max/fixed/ratio）
   - Amount
   - Sell Method（copy/not；不支持项禁用）
5. 点击 Confirm → `POST /api/copytrade/follow`。
6. 成功后：
   - TraderProfile 变为“已跟单”，展示策略摘要。
   - 可点击取消 → `DELETE /api/copytrade/follow/:traderId`。

### 4.3 防循环策略（禁止双向跟单）
- 当 A 试图跟单 B 时，如果 B 已经跟单 A：
  - 后端拒绝：`BIDIRECTIONAL_FOLLOW_NOT_ALLOWED`。
  - 前端提示：避免循环跟单。

### 4.4 交易与跟单成交复制
1. 交易员（或任何用户）在 TokenDetail 发起 buy/sell：`POST /api/trade/buy|sell`。
2. 后端写入该用户 trades，并更新 wallets/positions。
3. 后端查找 followers 的 copyFollows：
   - buy：按 buyMode 计算 spend。
   - sell：若 not_sell 则跳过，否则复制卖出。
4. follower 的复制成交也会写入 follower 的 trades，并带 `copiedFromUserId`。

### 4.5 Token 页 trades 展示口径
- TokenDetail trades 采用 token 维度聚合：`GET /api/trade/token-history?tokenAddress=...`。
- 该列表包含：
  - 原始成交（trader 本人）
  - 跟单复制成交（followers），因此“他们都是这个 token 的交易记录”。

## 5. 术语与约定

- **trades**：模拟成交记录（buy/sell、solAmount、tokenAmount、rate、createdAt）。
- **positions**：用户对各 token 的余额（key=tokenAddress）。
- **copyFollows**：跟单配置（traderId + 买入规则 + 卖出策略）。


# 📋 Stock Portfolio Manager — PRD v3.0

## 1. 产品概述

| 项目 | 说明 |
|------|------|
| **产品名称** | Stock Portfolio Manager（股票投资组合管理器） |
| **目标用户** | 单个个人投资者 |
| **运行平台** | macOS 桌面应用（Tauri） |
| **支持市场** | 🇺🇸 美股（US）、🇨🇳 A股（CN）、🇭🇰 港股（HK） |
| **多账户** | 每个市场支持多个证券账户 |
| **核心价值** | 统一管理三地市场多账户持仓，按策略分类分析，季度仓位追踪，任意时间段绩效分析 |

## 2. 技术栈

| 层面 | 技术选型 |
|------|----------|
| **桌面框架** | Tauri 2.0 |
| **前端** | React 18 + TypeScript + Vite |
| **样式** | TailwindCSS + Ant Design |
| **图表** | ECharts |
| **状态管理** | Zustand |
| **后端** | Rust (Tauri Core) |
| **数据库** | SQLite (rusqlite / sqlx) |
| **HTTP 请求** | reqwest |
| **异步运行时** | tokio |
| **日期处理** | chrono (Rust) / dayjs (前端) |

## 3. 核心概念模型

```
用户 (单用户)
 └── 投资组合 Portfolio
      ├── 🇺🇸 美股 (US Market)
      │    ├── 账户: Robinhood
      │    │    ├── AAPL [成长股] - 100股
      │    │    └── MSFT [成长股] - 80股
      │    └── 账户: Interactive Brokers
      │         ├── KO   [分红股] - 200股
      │         └── JNJ  [分红股] - 150股
      ├── 🇨🇳 A股 (CN Market)
      │    ├── 账户: 中信证券
      │    │    ├── 600519.SH [成长股] - 10股
      │    │    └── 510300.SH [现金类] - 5000股
      │    └── 账户: 华泰证券
      │         └── 000858.SZ [套利] - 300股
      └── 🇭🇰 港股 (HK Market)
           └── 账户: 富途证券
                ├── 0700.HK [成长股] - 100股
                └── 1299.HK [分红股] - 500股
```

## 4. 数据模型设计

### 4.1 证券账户表 (Accounts)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `name` | String | 账户名称 |
| `market` | Enum | 所属市场：`US` / `CN` / `HK` |
| `description` | String | 账户备注（可选） |
| `created_at` | DateTime | 创建时间 |
| `updated_at` | DateTime | 更新时间 |

### 4.2 持仓表 (Holdings)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `account_id` | UUID | 外键 → 证券账户 |
| `symbol` | String | 股票代码 |
| `name` | String | 股票名称 |
| `market` | Enum | 市场：`US` / `CN` / `HK` |
| `category_id` | UUID | 外键 → 投资类别 |
| `shares` | Decimal | 当前持有股数 |
| `avg_cost` | Decimal | 平均成本价 |
| `currency` | Enum | 币种：`USD` / `CNY` / `HKD` |
| `created_at` | DateTime | 创建时间 |
| `updated_at` | DateTime | 更新时间 |

### 4.3 交易记录表 (Transactions)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `holding_id` | UUID | 外键 → 持仓（可选） |
| `account_id` | UUID | 外键 → 证券账户 |
| `symbol` | String | 股票代码 |
| `name` | String | 股票名称 |
| `market` | Enum | 市场 |
| `type` | Enum | 交易类型：`BUY` / `SELL` |
| `shares` | Decimal | 交易股数 |
| `price` | Decimal | 成交价格 |
| `total_amount` | Decimal | 成交总额 |
| `commission` | Decimal | 手续费/佣金 |
| `currency` | Enum | 币种 |
| `traded_at` | DateTime | 成交时间 |
| `notes` | String | 交易备注（可选） |
| `created_at` | DateTime | 创建时间 |

### 4.4 投资类别表 (Categories)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `name` | String | 类别名称 |
| `color` | String | 展示颜色（Hex） |
| `icon` | String | 图标标识 |
| `is_system` | Boolean | 是否系统预设 |
| `sort_order` | Integer | 排序顺序 |
| `created_at` | DateTime | 创建时间 |

**系统预设类别：**
- 💵 现金类 (`#22C55E`)
- 💰 分红股 (`#3B82F6`)
- 🚀 成长股 (`#F97316`)
- 🔄 套利 (`#8B5CF6`)

用户可自定义扩展更多类别。

### 4.5 季度快照表 (Quarterly Snapshots)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `quarter` | String | 季度标识：`2026-Q1` |
| `snapshot_date` | Date | 快照日期 |
| `total_value_base` | Decimal | 总资产（基准货币） |
| `us_value` | Decimal | 美股总市值（USD） |
| `cn_value` | Decimal | A股总市值（CNY） |
| `hk_value` | Decimal | 港股总市值（HKD） |
| `exchange_rates` | JSON | 快照时汇率 |
| `summary_notes` | Text | 本季度整体操作思考总结 |
| `created_at` | DateTime | 创建时间 |
| `updated_at` | DateTime | 更新时间 |

### 4.6 季度快照明细表 (Snapshot Details)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `snapshot_id` | UUID | 外键 → 季度快照 |
| `account_id` | UUID | 证券账户ID |
| `account_name` | String | 账户名称 |
| `symbol` | String | 股票代码 |
| `name` | String | 股票名称 |
| `market` | Enum | 市场 |
| `category_name` | String | 类别名称 |
| `shares` | Decimal | 持有股数 |
| `avg_cost` | Decimal | 平均成本 |
| `price_at_snapshot` | Decimal | 快照时股价 |
| `market_value` | Decimal | 市值 |
| `profit_loss` | Decimal | 盈亏 |
| `weight_in_market` | Decimal | 在所属市场中的占比 |
| `weight_in_total` | Decimal | 在总资产中的占比 |

### 4.7 持仓变动操作思考表 (Position Change Notes)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键 |
| `snapshot_id` | UUID | 外键 → 季度快照 |
| `change_type` | Enum | 变动类型：`NEW` / `CLOSE` / `ADD` / `REDUCE` / `CATEGORY_CHANGE` |
| `symbol` | String | 股票代码 |
| `name` | String | 股票名称 |
| `market` | Enum | 市场 |
| `account_name` | String | 证券账户名称 |
| `shares_before` | Decimal | 变动前股数 |
| `shares_after` | Decimal | 变动后股数 |
| `price_at_change` | Decimal | 变动时价格 |
| `reasoning` | Text | 操作思考 — 为什么做这个操作 |
| `thesis` | Text | 投资逻辑 — 对这只股票的核心判断 |
| `risk_notes` | Text | 风险备注 — 关注的风险点 |
| `created_at` | DateTime | 创建时间 |
| `updated_at` | DateTime | 更新时间 |

### 4.8 每日组合净值表 (Daily Portfolio Values)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER | 主键 |
| `date` | DATE | 日期（交易日） |
| `total_cost` | Decimal | 当日总成本（基准货币） |
| `total_value` | Decimal | 当日总市值（基准货币） |
| `us_cost` | Decimal | 美股总成本（USD） |
| `us_value` | Decimal | 美股总市值（USD） |
| `cn_cost` | Decimal | A股总成本（CNY） |
| `cn_value` | Decimal | A股总市值（CNY） |
| `hk_cost` | Decimal | 港股总成本（HKD） |
| `hk_value` | Decimal | 港股总市值（HKD） |
| `exchange_rates` | JSON | 当日汇率 |
| `daily_pnl` | Decimal | 当日盈亏 |
| `cumulative_pnl` | Decimal | 累计盈亏 |

### 4.9 每日持仓明细快照表 (Daily Holding Snapshots)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INTEGER | 主键 |
| `date` | DATE | 日期 |
| `account_id` | UUID | 证券账户 |
| `symbol` | String | 股票代码 |
| `market` | Enum | 市场 |
| `category_name` | String | 当时的类别 |
| `shares` | Decimal | 当日持有股数 |
| `avg_cost` | Decimal | 当日平均成本 |
| `close_price` | Decimal | 当日收盘价 |
| `market_value` | Decimal | 当日市值 |

## 5. 功能模块

### 5.1 证券账户管理
- 添加/编辑/删除证券账户
- 每个市场支持多个账户
- 按市场分组展示

### 5.2 持仓录入与管理
- 选择账户 → 输入股票代码、名称、股数、买入均价、投资类别
- 编辑/删除持仓
- 类别管理：4预设 + 自定义扩展

### 5.3 交易记录管理
- 录入买入/卖出交易（自动更新持仓股数和平均成本）
- 交易历史查看和筛选（按市场/账户/股票/类型/时间）
- 平均成本计算：买入时加权平均，卖出时均价不变

### 5.4 仪表盘 Dashboard
- 总资产、总盈亏、今日盈亏
- 市场分布饼图
- 类别分布饼图
- 各账户概览

### 5.5 仓位统计
- 整体视图：三地市场合并统计
- 市场视图：美股/A股/港股各自独立统计
- 账户视图：单个证券账户统计
- 每个视图含：总市值、盈亏、类别分布、个股明细、持仓占比

### 5.6 Performance Analysis（任意时间段绩效分析）

#### 时间段选择
- 快捷选项：近1周/1月/3月/6月/1年/YTD/某年全年
- 自定义任意起止日期
- 分析范围：整体/按市场/按账户/按类别

#### 绩效指标
| 指标 | 说明 |
|------|------|
| 绝对收益 | 期末市值 - 期初市值 ± 资金流入流出 |
| 时间加权收益率 (TWR) | 消除资金流动影响的真实投资能力 |
| 年化收益率 | 标准化为年度收益 |
| 最大回撤 | 期间最大亏损幅度 |
| 波动率 | 年化波动率 |
| 夏普比率 | 风险调整后收益 |

#### 分析内容
- 收益概览卡片
- 收益曲线图（可对比基准指数）
- 回撤分析图
- 收益贡献分解（按市场/类别）
- 月度收益明细表
- 个股表现排行（最佳/最差）

#### 基准指数
| 市场 | 基准指数 |
|------|----------|
| 美股 | S&P 500, NASDAQ 100 |
| A股 | 沪深300, 上证指数 |
| 港股 | 恒生指数 |

### 5.7 季度仓位变化分析
- 季度快照：自动（季末）+ 手动创建
- 季度对比分析：
  - 总资产变化
  - 市场占比变化
  - 整体类别占比变化
  - 各市场类别占比变化（美股/A股/港股各自的类别占比季度变化）
  - 账户资产变化
  - 持仓变动（新建仓/清仓/加仓/减仓）
  - 季度收益率
- 持仓变动操作思考：每笔变动可填写操作思考、投资逻辑、风险备注
- 季度整体操作思考总结

### 5.8 实时数据
- 实时行情：美股/港股 (Yahoo Finance)、A股 (新浪财经)
- 实时汇率：ExchangeRate-API，缓存5-15分钟
- 季度快照时记录当时汇率
- 基准货币可选：USD / CNY / HKD

## 6. 项目目录结构

```
stock-portfolio-manager/
├── src-tauri/                        # Rust 后端 (Tauri Core)
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── src/
│   │   ├── main.rs
│   │   ├── lib.rs
│   │   ├── db/
│   │   ├── models/
│   │   ├── commands/
│   │   ├── services/
│   │   └── utils/
│   └── icons/
├── src/                              # React 前端
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   └── utils/
├── docs/
│   └── PRD.md
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 7. 迭代计划

### Phase 1 — 基础框架 & 数据管理
- Tauri + React 项目搭建
- SQLite 数据库初始化 & 迁移
- 证券账户 CRUD
- 投资类别管理（4预设 + 自定义）
- 持仓录入/编辑/删除
- 交易记录管理（自动更新持仓）

### Phase 2 — 实时数据
- 美股/A股/港股实时行情获取
- 实时汇率获取 & 缓存
- 每日自动快照采集

### Phase 3 — 仓位统计
- 仪表盘（总览）
- 整体/分市场/分账户/分类别统计
- 可视化图表

### Phase 4 — 绩效分析
- 任意时间段选择
- 收益率计算（TWR + 年化）
- 收益曲线图 + 基准对比
- 最大回撤分析
- 收益贡献分解
- 月度收益明细
- 个股表现排行
- 风险指标

### Phase 5 — 季度分析
- 季度快照（自动 + 手动）
- 季度仓位对比（整体 + 分市场类别占比）
- 持仓变动操作思考
- 季度整体操作总结
- 多季度趋势图

### Phase 6 — 增强功能
- 数据导入导出（CSV/Excel）
- 季度报告导出（PDF/Markdown）
- 价格提醒通知
- 历史操作思考复盘
- AI 投资分析建议

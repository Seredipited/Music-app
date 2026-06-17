<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="#">
    <img src="public/music.svg" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">🎵 云音乐</h1>

  <p align="center">
    仿 QQ 音乐 · 在线音乐播放平台
    <br />
    基于 Vue 3 + TypeScript + Pinia + Tailwind CSS 构建
    <br />
    <br />
    <a href="#-在线演示"><strong>在线演示</strong></a>
    ·
    <a href="https://github.com/yourusername/music-app/issues">报告 Bug</a>
    ·
    <a href="https://github.com/yourusername/music-app/issues">请求功能</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js&logoColor=white" alt="Vue">
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Pinia-3.0-FFD859?style=flat-square&logo=vue.js&logoColor=black" alt="Pinia">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  </p>
</div>

<br />

<details open>
  <summary><strong>📑 目录</strong></summary>
  <ol>
    <li><a href="#-项目简介">项目简介</a></li>
    <li><a href="#-功能特性">功能特性</a></li>
    <li><a href="#-技术栈">技术栈</a></li>
    <li><a href="#-项目结构">项目结构</a></li>
    <li><a href="#-快速开始">快速开始</a></li>
    <li><a href="#-页面展示">页面展示</a></li>
    <li><a href="#-状态管理">状态管理</a></li>
    <li><a href="#-自定义主题">自定义主题</a></li>
    <li><a href="#-贡献指南">贡献指南</a></li>
    <li><a href="#-开源协议">开源协议</a></li>
  </ol>
</details>

---

## 📖 项目简介

**云音乐** 是一款仿 QQ 音乐的在线音乐播放单页应用（SPA），提供音乐浏览、搜索、播放以及评论互动等完整功能。项目采用 Vue 3 Composition API 编写，内置 40 首华语热门歌曲模拟数据，具备生产级代码架构。

### 为什么选择这个项目？

- 🏗️ **生产级架构** — 合理的目录划分、TypeScript 严格模式、组件化设计
- 🎨 **双主题设计** — 管理后台（浅色）与播放器/搜索页（深色）两套视觉风格
- 🔊 **跨页面播放** — 基于 Pinia 全局状态，切换页面不中断音乐播放
- 📝 **完整的交互闭环** — 搜索 → 播放 → 评论 → 收藏，端到端流程

---

## ✨ 功能特性

### 核心功能

| 模块 | 功能描述 |
|------|----------|
| 🏠 **音乐管理** | 表格展示全部歌曲，支持搜索过滤、分页浏览、添加新歌曲（含表单验证） |
| 🔍 **音乐搜索** | URL 驱动的实时搜索，按歌名 / 歌手 / 专辑筛选，搜索结果一键播放 |
| 🎧 **音乐播放器** | 全功能播放器 — 播放/暂停、上/下曲切换、进度拖拽、音量控制、静音切换 |
| 🔀 **播放模式** | 顺序播放、随机播放、单曲循环三种模式自由切换 |
| 📋 **播放列表** | 底部滑出式播放列表面板，支持添加、移除、清空、点击切歌 |
| ❤️ **收藏歌曲** | 一键收藏 / 取消收藏当前播放歌曲 |
| 💬 **评论区** | 热门评论 / 最新评论双 Tab，支持发布评论、点赞、加载更多 |
| 📱 **响应式布局** | 适配桌面端与移动端，侧边栏折叠，内容区自适应 |

### 交互细节

- 专辑封面播放时旋转动画（3 秒一圈）
- 进度条支持点击跳转 + 拖拽手柄
- 底部迷你播放栏跨页面常驻
- 添加歌曲表单完整验证（必填校验 + 错误提示）
- Dialog 模态框使用 Teleport 渲染至 body
- 模拟 300ms 异步延迟，还原真实 API 交互体验

---

## 🛠 技术栈

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg" width="48" height="48" alt="Vue" />
      <br><strong>Vue 3</strong>
      <br><sub>3.5+</sub>
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
      <br><strong>TypeScript</strong>
      <br><sub>5.7+</sub>
    </td>
    <td align="center" width="96">
      <img src="https://pinia.vuejs.org/logo.svg" width="48" height="48" alt="Pinia" />
      <br><strong>Pinia</strong>
      <br><sub>3.0+</sub>
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind" />
      <br><strong>Tailwind</strong>
      <br><sub>3.4+</sub>
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" width="48" height="48" alt="Vite" />
      <br><strong>Vite</strong>
      <br><sub>6.2+</sub>
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postcss/postcss-original.svg" width="48" height="48" alt="PostCSS" />
      <br><strong>PostCSS</strong>
      <br><sub>8.5+</sub>
    </td>
  </tr>
</table>

### 依赖清单

| 依赖 | 版本 | 说明 |
|------|------|------|
| `vue` | ^3.5.13 | 渐进式前端框架 |
| `vue-router` | ^4.5.0 | 官方路由管理器 |
| `pinia` | ^3.0.2 | 直观的类型安全状态管理 |
| `lucide-vue-next` | ^0.475.0 | 精美 SVG 图标库 |
| `tailwindcss` | ^3.4.17 | Utility-first CSS 框架 |
| `autoprefixer` | ^10.4.20 | CSS 自动前缀 |
| `vite` | ^6.2.0 | 下一代前端构建工具 |
| `typescript` | ^5.7.3 | JavaScript 超集 |
| `vue-tsc` | ^2.2.0 | Vue 类型检查 CLI |

---

## 📁 项目结构

```
Music-app/
├── index.html                          # 入口 HTML
├── package.json                        # 项目元数据与脚本
├── vite.config.ts                      # Vite 配置（含 @ 别名）
├── tsconfig.json                       # TypeScript 配置入口
├── tsconfig.app.json                   # 应用 TS 配置
├── tsconfig.node.json                  # Node/Vite TS 配置
├── tailwind.config.js                  # Tailwind 自定义主题
├── postcss.config.js                   # PostCSS 配置
├── public/
│   └── music.svg                       # Favicon
└── src/
    ├── main.ts                         # 应用入口 — 挂载 Vue/Pinia/Router
    ├── App.vue                         # 根组件 — 整体布局骨架
    ├── index.css                       # 全局样式（Tailwind 指令 + 自定义层）
    ├── vite-env.d.ts                   # Vite 环境类型声明
    ├── router/
    │   └── index.ts                    # 路由配置（3 条路由）
    ├── stores/
    │   ├── types.ts                    # TypeScript 接口定义
    │   ├── data.ts                     # 模拟数据（40 首歌 + 6 条评论 + API 函数）
    │   └── player.ts                   # 播放器状态管理（Pinia Store）
    ├── lib/
    │   └── utils.ts                    # 工具函数（格式化、防抖、节流）
    ├── views/
    │   ├── Home.vue                    # 首页 — 音乐歌曲管理
    │   ├── Search.vue                  # 搜索页 — 音乐搜索
    │   └── Player.vue                  # 播放器页 — 详情播放 + 评论区
    └── components/
        ├── layout/
        │   ├── AppHeader.vue           # 顶部导航栏（毛玻璃效果）
        │   ├── AppFooter.vue           # 底部播放栏（固定常驻）
        │   └── Sidebar.vue             # 侧边栏菜单
        ├── music/
        │   └── MusicCard.vue           # 歌曲卡片组件
        ├── ui/
        │   ├── Dialog.vue              # 通用对话框（Teleport + Transition）
        │   ├── Pagination.vue          # 分页组件
        │   └── SongForm.vue            # 添加歌曲表单（含验证）
        └── comments/
            └── CommentSection.vue       # 评论区组件
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0（或 pnpm / yarn）

### 安装

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/music-app.git

# 2. 进入项目目录
cd music-app

# 3. 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器（默认 http://localhost:5173）
npm run dev
```

开发服务器默认监听 `0.0.0.0`，支持局域网内其他设备访问。

### 构建与预览

```bash
# 生产构建（先类型检查，后打包）
npm run build

# 预览生产构建
npm run preview
```

> **注意**：`build` 命令会先执行 `vue-tsc --build` 进行 TypeScript 类型检查，检查通过后才会调用 `vite build` 打包。

### 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | vue-tsc 类型检查 + Vite 生产构建 |
| `npm run preview` | 预览已构建的生产版本 |

---

## 🖼 页面展示

### 路由一览

| 路径 | 名称 | 组件 | 功能描述 |
|------|------|------|----------|
| `/` | home | `Home.vue` | 音乐歌曲管理主页 — 表格展示、搜索过滤、分页、添加歌曲 |
| `/search?q=关键词` | search | `Search.vue` | 音乐搜索页 — 按歌名/歌手/专辑搜索，URL 参数同步 |
| `/player/:id` | player | `Player.vue` | 播放器详情页 — 专辑封面、播放控制、进度/音量、评论区 |

### 组件层级

```
App.vue
├── Sidebar.vue              ← 左侧深色导航菜单
│   ├── Logo
│   ├── 音乐歌曲
│   ├── 音乐类型
│   ├── 音乐标签
│   ├── 歌手管理
│   ├── 专辑管理
│   └── 统计分析
├── <RouterView />           ← 页面内容区
│   ├── Home.vue
│   │   ├── SongForm.vue     （Dialog 内嵌）
│   │   └── Pagination.vue
│   ├── Search.vue
│   │   └── MusicCard.vue
│   └── Player.vue
│       └── CommentSection.vue
└── AppFooter.vue            ← 底部播放栏（固定）
    ├── 进度条 + 控制按钮
    ├── 音量滑块
    ├── 播放模式切换
    └── 播放列表面板（弹出式）
```

---

## 🧠 状态管理

项目使用 **Pinia** 进行全局状态管理，核心 Store 为 `player.ts`：

```typescript
// 播放器 Store 核心状态
interface PlayerState {
  currentSong: Song | null      // 当前播放歌曲
  playlist: Song[]              // 播放列表
  isPlaying: boolean            // 播放状态
  currentTime: number           // 当前播放时间
  duration: number              // 总时长
  progress: number              // 播放进度 0-100
  volume: number                // 音量 0-1
  isMuted: boolean              // 是否静音
  playMode: 'sequential' | 'random' | 'loop'  // 播放模式
  isShowPlaylist: boolean       // 播放列表面板可见性
  likedSongs: Set<number>       // 收藏歌曲 ID 集合
}
```

**关键 Actions：**
- `playSong(song)` — 切换播放指定歌曲
- `togglePlay()` — 播放/暂停切换
- `nextSong()` / `prevSong()` — 上/下一首（支持三种播放模式逻辑）
- `addToPlaylist(song)` — 添加到播放列表
- `removeFromPlaylist(id)` — 从播放列表移除
- `clearPlaylist()` — 清空播放列表
- `toggleLike(id)` — 收藏/取消收藏

---

## 🎨 自定义主题

项目在 `tailwind.config.js` 中扩展了四套自定义颜色系统：

| 色系 | 主色 | 使用场景 |
|------|------|----------|
| **primary** | `#f97316`（橙色） | 全局主色调、强调元素 |
| **warm** | `#eab308`（黄色） | 温暖氛围元素 |
| **earth** | `#b8956f`（大地色） | 播放器页面、深色主题 |
| **dark** | 深棕色系 | 侧边栏、深色区域 |

### 自定义动画

- `spin-slow` — 3 秒慢速旋转（专辑封面播放动画）
- `pulse-glow` — 脉冲发光效果
- `slide-up` / `fade-in` — 入场过渡动画

### 自定义 CSS 工具类

```css
.gradient-primary   /* 蓝色渐变背景 (#409eff → #337ecc) */
.glass-effect       /* 毛玻璃效果 (backdrop-filter: blur(12px)) */
.text-gradient      /* 渐变文字效果 */
```

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下流程：

1. **Fork** 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat: add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 创建 **Pull Request**

### 提交规范

本项目推荐使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` — 新功能
- `fix:` — Bug 修复
- `refactor:` — 代码重构
- `style:` — 样式调整
- `docs:` — 文档更新
- `chore:` — 构建/工具链变更

---

## 📄 开源协议

本项目基于 **MIT License** 开源。

<div align="center">
  <br />
  <p>如果这个项目对你有帮助，请给一个 ⭐ Star 支持一下！</p>
  <br />
  <sub>Made with ❤️ by Music App Team</sub>
</div>

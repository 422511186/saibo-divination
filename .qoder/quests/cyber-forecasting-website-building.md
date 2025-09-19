# 赛博算卦网站设计文档

## 目录
1. [概述](#1-概述)
2. [技术栈与依赖](#2-技术栈与依赖)
3. [组件架构](#3-组件架构)
4. [状态管理](#4-状态管理)
5. [路由与导航](#5-路由与导航)
6. [数据模型](#6-数据模型)
7. [API集成层](#7-api集成层)
8. [样式架构](#8-样式架构)
9. [测试策略](#9-测试策略)
10. [算卦功能模块设计](#10-算卦功能模块设计)
11. [部署与优化](#11-部署与优化)

## 1. 概述

### 1.1 项目目标
构建一个融合现代前端技术与传统算卦文化元素的在线算卦平台，使用Vue3、TypeScript和Vite技术栈，为用户提供具有视觉吸引力和良好交互体验的算卦服务。

### 1.2 核心特性
- 现代化的UI界面设计，融合赛博朋克和传统元素
- 多种算卦方式（如六爻、八字、塔罗牌等）
- 算卦历史记录与管理
- 用户个性化设置
- 响应式设计，支持多端访问
- 智能解读与建议

### 1.3 用户群体
- 对传统文化和现代科技结合感兴趣的用户
- 寻求生活指导和心理慰藉的用户
- 对赛博朋克美学感兴趣的年轻用户
- 希望通过数字化方式体验传统算卦的用户

## 2. 技术栈与依赖

### 2.1 核心技术栈
- Vue 3 (Composition API)
- TypeScript
- Vite
- Vue Router 4
- Pinia (状态管理)

### 2.2 UI组件库
- Tailwind CSS (样式框架)
- 自定义Cyber风格组件 (CyberButton, CyberCard, CyberModal)

### 2.3 开发工具
- ESLint (代码规范)
- Prettier (代码格式化)
- Vitest (单元测试)
- Cypress (端到端测试)

### 2.4 构建与部署
- Vite (构建工具)
- Docker (容器化部署)
- GitHub Actions (CI/CD)
- Netlify/Vercel (静态部署)

## 3. 组件架构

### 3.1 组件层次结构
```
App.vue
├── layouts/
│   └── MainLayout.vue
├── components/
│   ├── ui/
│   │   ├── CyberButton.vue
│   │   ├── CyberCard.vue
│   │   ├── CyberModal.vue
│   │   └── index.ts
│   ├── Header.vue
│   ├── Footer.vue
│   └── Navigation.vue
│   ├── DivinationForm.vue
│   ├── ResultDisplay.vue
│   └── HistoryList.vue
├── views/
│   ├── HomeView.vue
│   ├── DivinationView.vue
│   ├── HistoryView.vue
│   └── AboutView.vue
└── router/
    └── index.ts
```

### 3.2 核心组件定义

#### CyberButton.vue
- 功能：自定义按钮组件，具有赛博朋克风格
- Props：
  - `variant`: 按钮样式变体
  - `size`: 按钮大小
  - `disabled`: 是否禁用

#### CyberCard.vue
- 功能：卡片容器组件，用于展示内容
- Props：
  - `title`: 卡片标题
  - `bordered`: 是否显示边框

#### CyberModal.vue
- 功能：模态框组件，用于显示重要信息
- Props：
  - `visible`: 是否可见
  - `title`: 模态框标题

## 4. 状态管理

### 4.1 Store结构
```
stores/
├── counter.ts      # 计数器示例
├── divination.ts   # 算卦相关状态
├── settings.ts     # 用户设置
├── history.ts      # 历史记录管理
└── index.ts        # Store入口文件
```

### 4.2 核心Store说明

#### divination.ts
- 管理算卦相关数据
- 包含当前算卦结果、历史记录等
- 提供算卦算法接口

#### settings.ts
- 管理用户个性化设置
- 包含主题、语言偏好等

#### history.ts
- 管理用户的算卦历史记录
- 提供历史记录的增删改查功能
- 支持本地存储和云端同步

## 5. 路由与导航

### 5.1 路由配置
```typescript
const routes = [
  { path: '/', component: HomeView },
  { path: '/divination', component: DivinationView },
  { path: '/divination/:type', component: DivinationView },
  { path: '/history', component: HistoryView },
  { path: '/result/:id', component: ResultView },
  { path: '/settings', component: SettingsView },
  { path: '/about', component: AboutView }
]
```

### 5.2 页面功能说明
- **HomeView**: 首页，展示网站介绍和快速入口
- **DivinationView**: 算卦主页面，提供算卦功能，支持不同算卦类型
- **HistoryView**: 历史记录页面，查看过往算卦结果
- **ResultView**: 算卦结果详情页面
- **SettingsView**: 用户设置页面
- **AboutView**: 关于页面，介绍项目信息

## 6. 数据模型

### 6.1 算卦数据结构
```typescript
interface DivinationResult {
  id: string;
  type: 'hexagram' | 'eight-characters' | 'tarot' | 'i-ching';
  question: string;
  result: any;
  timestamp: Date;
  interpretation: string;
  hexagrams?: Hexagram[];
  eightCharacters?: EightCharacters;
}

interface Hexagram {
  name: string;
  symbol: string;
  meaning: string;
  changingLines: number[];
}

interface EightCharacters {
  year: string;
  month: string;
  day: string;
  hour: string;
  elements: string[];
}
```

### 6.2 用户设置结构
```typescript
interface UserSettings {
  theme: 'light' | 'dark' | 'cyber';
  language: 'zh' | 'en';
  notifications: boolean;
  autoSave: boolean;
  shareResults: boolean;
}

### 6.3 历史记录结构
```typescript
interface HistoryRecord {
  id: string;
  title: string;
  type: string;
  date: Date;
  preview: string;
}
```

## 7. API集成层

### 7.1 工具函数
```
utils/
├── api.ts      # API请求封装
├── date.ts     # 日期处理
├── random.ts   # 随机数生成
├── storage.ts  # 本地存储
├── divinationAlgorithms.ts  # 算卦算法实现
└── formatter.ts  # 结果格式化
```

### 7.2 核心工具说明
- **api.ts**: 封装算卦算法和外部API调用
- **random.ts**: 实现符合算卦需求的随机数生成算法
- **storage.ts**: 管理本地存储，保存用户数据
- **divinationAlgorithms.ts**: 实现六爻、八字等传统算卦算法
- **formatter.ts**: 格式化算卦结果，便于展示

## 8. 样式架构

### 8.1 样式策略
- 使用Tailwind CSS作为基础样式框架
- 自定义赛博朋克风格主题
- 响应式设计适配不同设备
- CSS变量管理主题色
- 动画效果增强交互体验

### 8.2 主题变量
```css
:root {
  --cyber-primary: #00f7ff;        /* 主色调 青色 */
  --cyber-secondary: #ff00f7;      /* 辅助色调 紫色 */
  --cyber-background: #0a0a0a;     /* 背景色 深黑色 */
  --cyber-surface: #1a1a1a;        /* 表面色 */
  --cyber-text: #ffffff;           /* 主要文字色 */
  --cyber-text-secondary: #cccccc; /* 次要文字色 */
  --cyber-accent: #ffff00;         /* 强调色 黄色 */
  --cyber-glow: 0 0 10px #00f7ff, 0 0 20px #00f7ff;
}
```

### 8.3 赛博朋克设计元素
- 霓虹光效和发光边框
- 数字化网格背景
- 故障艺术效果
- 金属质感和电路板纹理
- 全息投影视觉效果

## 9. 测试策略

### 9.1 单元测试
- 使用Vitest进行组件和工具函数测试
- 覆盖核心业务逻辑
- 测试算卦算法的正确性
- 验证状态管理功能

### 9.2 端到端测试
- 使用Cypress测试用户交互流程
- 验证主要功能路径
- 测试不同设备的响应式表现
- 验证表单输入和结果展示

### 9.3 性能测试
- 使用Lighthouse进行性能评估
- 测试首屏加载速度
- 验证移动端性能表现

## 10. 算卦功能模块设计

### 10.1 六爻算卦模块
- 钱币起卦法实现
- 三枚钱币随机算法
- 卦象解析与变卦计算
- 爻位动变分析

### 10.2 八字算命模块
- 生辰八字排盘
- 天干地支计算
- 五行分析
- 十神关系解析

### 10.3 塔罗牌模块
- 78张塔罗牌数据
- 洗牌与抽牌算法
- 牌阵布局设计
- 解牌逻辑实现

## 11. 部署与优化

### 11.1 构建优化
- 利用Vite的代码分割功能
- 静态资源压缩优化
- 预加载关键资源
- 图片懒加载和WebP格式优化
- Service Worker缓存策略

### 11.2 部署方案
- 支持静态部署到CDN
- 提供Docker容器化部署选项
- GitHub Pages部署配置
- Netlify/Vercel一键部署

### 11.3 性能监控
- 集成性能监控工具
- 错误日志收集
- 用户行为分析
- 核心Web指标监控

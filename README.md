# Cyber Fortune Telling (赛博算卦)

一个融合传统文化与现代科技的算卦应用，使用Vue 3、TypeScript和Vite构建。

## 功能特性

- 多种算卦方式：塔罗牌、易经、千师签、梅花易数
- 赛博朋克风格的UI设计
- 丰富的动画效果
- 响应式布局，支持移动端

## 增强版塔罗牌动画

本项目新增了增强版塔罗牌动画功能，包含以下特性：

### 动画效果增强
- **扑克牌旋转效果**：实现类似真实洗牌的旋转效果，包括牌堆旋转洗牌动画和单张牌旋转抽出效果
- **3D翻牌效果**：使用CSS 3D变换和透视效果增强翻牌动画的立体感
- **粒子系统**：添加魔法粒子效果，包括洗牌时的星光粒子、抽牌时的魔法光效、翻牌时的金色粒子飞舞和完成时的彩色烟花效果

### 组件架构
- **EnhancedTarotCardAnimation.vue**：增强版塔罗牌动画组件
- **AnimationController**：动画控制模块，管理各种动画效果
- **ParticleSystem**：粒子系统，负责创建和管理粒子效果

### 配置选项
- `enableEnhancedAnimation`：是否启用增强动画（布尔值）
- `particleEffects`：是否启用粒子效果（布尔值）
- `animationSpeed`：动画速度（'slow' | 'normal' | 'fast'）

### 事件
- `animationStart`：动画开始时触发
- `animationComplete`：动画完成时触发
- `particleComplete`：粒子效果完成时触发
- `complete`：整个抽牌过程完成时触发

## 开发指南

### 项目结构

```
src/
├── components/        # 组件
├── data/             # 数据文件
├── router/           # 路由配置
├── store/            # 状态管理
├── styles/           # 样式文件
├── utils/            # 工具函数
│   ├── animations/   # 动画工具
│   ├── divinationAlgorithms/ # 算卦算法
│   └── helpers/      # 辅助函数
└── views/            # 页面视图
```

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- Vite
- GSAP (动画库)
- Sass (样式预处理器)
- Pinia (状态管理)

## 浏览器支持

现代浏览器，包括：
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 许可证

MIT

# 增强版塔罗牌动画使用指南

## 概述

增强版塔罗牌动画组件([EnhancedTarotCardAnimation.vue](../src/components/EnhancedTarotCardAnimation.vue))是基于原有塔罗牌动画组件的增强版本，添加了更丰富的视觉效果和交互功能。

## 功能特性

### 1. 动画效果增强
- **扑克牌旋转效果**：实现类似真实洗牌的旋转效果
- **3D翻牌效果**：使用CSS 3D变换增强翻牌动画的立体感
- **粒子系统**：添加魔法粒子效果，提升视觉体验

### 2. 可配置选项
- 动画速度控制
- 粒子效果开关
- 增强动画开关

### 3. 事件系统
- 动画开始/完成事件
- 粒子效果完成事件
- 抽牌完成事件

## 使用方法

### 基本使用

```vue
<template>
  <EnhancedTarotCardAnimation 
    :card-count="3" 
    @complete="onComplete"
  />
</template>

<script setup>
import EnhancedTarotCardAnimation from './components/EnhancedTarotCardAnimation.vue'

const onComplete = (cards) => {
  console.log('抽牌完成:', cards)
}
</script>
```

### 高级配置

```vue
<template>
  <EnhancedTarotCardAnimation 
    :card-count="3" 
    :enable-enhanced-animation="true"
    :particle-effects="true"
    animation-speed="normal"
    @complete="onComplete"
    @animationStart="onAnimationStart"
    @animationComplete="onAnimationComplete"
    @particleComplete="onParticleComplete"
  />
</template>

<script setup>
import EnhancedTarotCardAnimation from './components/EnhancedTarotCardAnimation.vue'

const onComplete = (cards) => {
  console.log('抽牌完成:', cards)
}

const onAnimationStart = () => {
  console.log('动画开始')
}

const onAnimationComplete = () => {
  console.log('动画完成')
}

const onParticleComplete = () => {
  console.log('粒子效果完成')
}
</script>
```

## 属性说明

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| cardCount | number | 3 | 抽取的卡牌数量 |
| enableEnhancedAnimation | boolean | false | 是否启用增强动画效果 |
| particleEffects | boolean | false | 是否启用粒子效果 |
| animationSpeed | 'slow' \| 'normal' \| 'fast' | 'normal' | 动画速度 |

## 事件说明

| 事件名 | 参数 | 描述 |
|--------|------|------|
| complete | cards: {number, suit}[] | 抽牌完成时触发 |
| animationStart | - | 动画开始时触发 |
| animationComplete | - | 动画完成时触发 |
| particleComplete | - | 粒子效果完成时触发 |

## 组件架构

```
EnhancedTarotCardAnimation.vue
├── AnimationController (动画控制模块)
│   ├── shuffleAnimation (洗牌动画)
│   ├── drawCardAnimation (抽牌动画)
│   ├── flipCardAnimation (翻牌动画)
│   └── completeAnimation (完成动画)
└── ParticleSystem (粒子系统)
    ├── createParticleEffect (创建粒子效果)
    └── destroy (销毁粒子系统)
```

## 样式定制

组件使用SCSS编写，可以通过修改以下变量来定制样式：

```scss
// 颜色变量
$card-back-gradient: linear-gradient(135deg, #8a2be2, #4b0082);
$card-front-gradient: linear-gradient(135deg, #f8f8ff, #e6e6fa);
$border-color: #4b0082;
$shadow-color: rgba(75, 0, 130, 0.5);

// 动画变量
$shuffle-duration: 1.5s;
$draw-duration: 0.8s;
$flip-duration: 0.8s;
```

## 性能优化

1. 使用CSS硬件加速
2. 粒子系统使用对象池复用粒子
3. 自动销毁超出生命周期的粒子
4. 低性能设备自动降级处理

## 测试

可以通过访问 [/tarot-test](http://localhost:5173/tarot-test) 页面来测试增强版塔罗牌动画组件的所有功能。
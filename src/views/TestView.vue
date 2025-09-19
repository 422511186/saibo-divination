<template>
  <div class="test-view">
    <h1>测试页面</h1>
    <p>这是一个简单的测试页面，用于验证增强版塔罗牌动画组件是否正常工作。</p>
    
    <div style="height: 400px; display: flex; justify-content: center; align-items: center;">
      <EnhancedTarotCardAnimation 
        :card-count="3" 
        :enable-enhanced-animation="true"
        :particle-effects="true"
        animation-speed="normal"
        @complete="onComplete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import EnhancedTarotCardAnimation from '@/components/EnhancedTarotCardAnimation.vue'

const onComplete = (cards: {number: number, suit: number}[]) => {
  console.log('抽牌完成:', cards)
}
</script>

<style scoped>
.test-view {
  padding: 2rem;
  min-height: 100vh;
}
</style>
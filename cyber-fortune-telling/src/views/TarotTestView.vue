<template>
  <div class="tarot-test-view">
    <div class="cyber-header">
      <h1 class="cyber-title">增强版塔罗牌动画测试</h1>
      <p class="cyber-subtitle">测试增强的动画效果和粒子系统</p>
    </div>
    
    <div class="test-container">
      <div class="controls">
        <div class="control-group">
          <label>动画速度:</label>
          <select v-model="animationSpeed">
            <option value="slow">慢速</option>
            <option value="normal">正常</option>
            <option value="fast">快速</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>
            <input type="checkbox" v-model="enableEnhancedAnimation" />
            启用增强动画
          </label>
        </div>
        
        <div class="control-group">
          <label>
            <input type="checkbox" v-model="particleEffects" />
            启用粒子效果
          </label>
        </div>
        
        <button class="cyber-button" @click="startTest">开始测试</button>
      </div>
      
      <div class="animation-area">
        <EnhancedTarotCardAnimation 
          :card-count="3" 
          :enable-enhanced-animation="enableEnhancedAnimation"
          :particle-effects="particleEffects"
          :animation-speed="animationSpeed"
          @complete="onComplete"
          @animationStart="onAnimationStart"
          @animationComplete="onAnimationComplete"
          @particleComplete="onParticleComplete"
          v-if="showAnimation"
        />
        
        <div v-else class="placeholder">
          <p>点击"开始测试"按钮查看增强版塔罗牌动画效果</p>
        </div>
      </div>
      
      <div class="log-area">
        <h3>事件日志</h3>
        <div class="log-content">
          <div v-for="(log, index) in logs" :key="index" class="log-item">
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EnhancedTarotCardAnimation from '@/components/EnhancedTarotCardAnimation.vue'

// 响应式数据
const showAnimation = ref(false)
const enableEnhancedAnimation = ref(true)
const particleEffects = ref(true)
const animationSpeed = ref<'slow' | 'normal' | 'fast'>('normal')
const logs = ref<string[]>([])

// 事件处理
const startTest = () => {
  showAnimation.value = true
  logs.value = []
  addLog('开始测试增强版塔罗牌动画')
}

const onAnimationStart = () => {
  addLog('动画开始')
}

const onAnimationComplete = () => {
  addLog('动画完成')
}

const onParticleComplete = () => {
  addLog('粒子效果完成')
}

const onComplete = (cards: {number: number, suit: number}[]) => {
  addLog(`抽牌完成，共抽取 ${cards.length} 张牌`)
  showAnimation.value = false
}

const addLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.push(`[${timestamp}] ${message}`)
  
  // 保持最新的20条日志
  if (logs.value.length > 20) {
    logs.value.shift()
  }
}
</script>

<style scoped lang="scss">
.tarot-test-view {
  min-height: 100vh;
  padding: 2rem 1rem;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
}

.cyber-header {
  text-align: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
}

.test-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
}

.controls {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  label {
    color: #00f0ff;
    font-size: 1rem;
    cursor: pointer;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
  
  select {
    background: rgba(8, 8, 16, 0.7);
    border: 1px solid #bc13fe;
    border-radius: 5px;
    padding: 0.5rem;
    color: #00f0ff;
    font-family: inherit;
    
    &:focus {
      outline: none;
      border-color: #00f0ff;
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
    }
    
    @media (max-width: 768px) {
      padding: 0.4rem;
      font-size: 0.9rem;
    }
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    
    @media (max-width: 768px) {
      width: 16px;
      height: 16px;
    }
  }
}

.animation-area {
  height: 400px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(8, 8, 16, 0.5);
  border-radius: 10px;
  border: 1px solid #bc13fe;
  
  @media (max-width: 768px) {
    height: 300px;
  }
}

.placeholder {
  text-align: center;
  color: #00f0ff;
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.log-area {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.log-area h3 {
  color: #00f0ff;
  margin-bottom: 1rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
  background: rgba(8, 8, 16, 0.7);
  border-radius: 5px;
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    max-height: 150px;
  }
}

.log-item {
  color: #ff00ff;
  font-family: monospace;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
  }
}
</style>
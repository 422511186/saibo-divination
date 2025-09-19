<template>
  <div class="qianshi-animation-container">
    <div class="qianshi-container" ref="qianshiContainer">
      <!-- 签筒 -->
      <div v-if="!isDrawing" class="qiantong-section">
        <div class="qiantong" @click="startDrawing" :class="{ disabled: isDrawing }">
          <div class="qiantong-body">
            <div class="qiantong-top"></div>
            <div class="qiantong-middle"></div>
            <div class="qiantong-bottom"></div>
            <div class="qian-sticks">
              <div 
                v-for="n in 30" 
                :key="n" 
                class="qian-stick"
                :style="{ transform: `rotate(${n * 12}deg) translateY(-90px)` }"
              ></div>
            </div>
          </div>
          <div class="qiantong-glow"></div>
        </div>
        <div class="draw-hint">点击签筒开始抽签</div>
        <div class="draw-subtitle">虔诚祈祷后点击</div>
      </div>
      
      <!-- 抽签动画 -->
      <div v-else-if="isDrawing" class="drawing-animation">
        <div class="qiantong-wrapper">
          <div class="qiantong-shaking">
            <div class="qiantong">
              <div class="qiantong-body">
                <div class="qiantong-top"></div>
                <div class="qiantong-middle"></div>
                <div class="qiantong-bottom"></div>
                <div class="qian-sticks">
                  <div 
                    v-for="n in 30" 
                    :key="n" 
                    class="qian-stick"
                    :style="{ transform: `rotate(${n * 12 + shakeAngle}deg) translateY(-90px)` }"
                  ></div>
                </div>
              </div>
              <div class="qiantong-glow"></div>
            </div>
          </div>
          
          <div class="floating-sticks" v-if="showFloatingSticks">
            <div 
              v-for="n in 5" 
              :key="n"
              class="floating-stick"
              :style="getFloatingStickStyle(n)"
            ></div>
          </div>
        </div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="progress-text">{{ drawProgressText }}</div>
        </div>
      </div>
      
      <!-- 签诗结果 -->
      <div v-else-if="showResult" class="result-section">
        <div class="qian-card">
          <div class="qian-header">
            <div class="qian-symbol">筶</div>
            <div class="qian-number">第{{ qianNumber }}签</div>
          </div>
          <div class="qian-title">{{ qianTitle }}</div>
          <div class="qian-divider"></div>
          <div class="qian-content">{{ qianContent }}</div>
        </div>
        
        <div class="result-actions">
          <button class="cyber-button" @click="revealPoem">查看签诗详解</button>
        </div>
      </div>
      
      <!-- 签诗内容 -->
      <div v-else-if="showPoem" class="poem-section">
        <div class="poem-card">
          <div class="poem-header">
            <div class="poem-number">第{{ qianNumber }}签</div>
            <div class="poem-title">{{ qianTitle }}</div>
          </div>
          <div class="poem-divider"></div>
          <div class="poem-content">{{ qianContent }}</div>
          <div class="poem-divider"></div>
          <div class="poem-explanation">{{ qianExplanation }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { performQianShiDivination } from '../utils/divinationAlgorithms/qianShi'

const emit = defineEmits<{
  (e: 'complete', qianNumber: number): void
}>()

const isDrawing = ref(false)
const showResult = ref(false)
const showPoem = ref(false)
const qianNumber = ref(0)
const qianTitle = ref('')
const qianContent = ref('')
const qianExplanation = ref('')
const shakeAngle = ref(0)
const drawStep = ref(0)
const shakeInterval = ref<number | null>(null)
const showFloatingSticks = ref(false)
const progressPercent = ref(0)

const drawProgressText = computed(() => {
  if (drawStep.value === 0) return "虔诚祈祷中..."
  if (drawStep.value === 1) return "摇动签筒中..."
  if (drawStep.value === 2) return "签诗即将出现..."
  return "抽签完成!"
})

const getFloatingStickStyle = (index: number) => {
  return {
    '--index': index,
    'animation-delay': `${index * 0.3}s`
  }
}

const startDrawing = () => {
  // 防止重复点击
  if (isDrawing.value) return
  
  isDrawing.value = true
  drawStep.value = 0
  progressPercent.value = 0
  
  // 第一步：祈祷动画
  setTimeout(() => {
    drawStep.value = 1
    progressPercent.value = 30
    
    // 开始摇动签筒
    startShaking()
    
    // 显示飞出的签
    setTimeout(() => {
      showFloatingSticks.value = true
    }, 1000)
    
    // 模拟抽签过程
    setTimeout(() => {
      stopShaking()
      drawStep.value = 2
      progressPercent.value = 70
      
      // 使用真实的签诗算法
      try {
        const result = performQianShiDivination()
        const selectedQian = result.poem
        
        qianNumber.value = selectedQian.number
        qianTitle.value = selectedQian.title
        qianContent.value = selectedQian.content
        qianExplanation.value = selectedQian.explanation
      } catch (error) {
        console.error("签诗抽取失败:", error)
        // 使用默认签诗
        qianNumber.value = 1
        qianTitle.value = "第一签 - 上上签"
        qianContent.value = "天开地辟作良缘，日吉时良万物全；若得此签非小可，人行忠正帝王宣。"
        qianExplanation.value = "此签为上上签，表示天时地利人和，凡事皆吉。求得此签者，将会得到贵人相助，事业顺利，家庭和睦。"
      }
      
      setTimeout(() => {
        isDrawing.value = false
        showResult.value = true
        drawStep.value = 3
        progressPercent.value = 100
        
        // 发送完成事件
        emit('complete', qianNumber.value)
      }, 2000)
    }, 4000)
  }, 1500)
}

const startShaking = () => {
  if (shakeInterval.value) {
    clearInterval(shakeInterval.value)
  }
  
  shakeInterval.value = window.setInterval(() => {
    shakeAngle.value = Math.sin(Date.now() / 100) * 40
  }, 50) as unknown as number
}

const stopShaking = () => {
  if (shakeInterval.value) {
    clearInterval(shakeInterval.value)
    shakeInterval.value = null
  }
  shakeAngle.value = 0
}

const revealPoem = () => {
  showResult.value = false
  showPoem.value = true
}

onUnmounted(() => {
  if (shakeInterval.value) {
    clearInterval(shakeInterval.value)
  }
})
</script>

<style scoped lang="scss">
.qianshi-animation-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: visible;
}

.qianshi-container {
  position: relative;
  width: 100%;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.qiantong-section,
.drawing-animation,
.result-section,
.poem-section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* 保持所有状态在同一位置 */
}

.qiantong {
  width: 130px;
  height: 160px;
  margin: 0 auto 25px;
  cursor: pointer;
  perspective: 1000px;
  position: relative;
  
  &.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.qiantong-body {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  z-index: 2;
}

.qiantong-top {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 25px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.qiantong-middle {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  width: 130px;
  height: 100px;
  background: linear-gradient(135deg, #8b4513, #a0522d);
  border: 2px solid #daa520;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

.qiantong-bottom {
  position: absolute;
  top: 125px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 35px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 0 0 20px 20px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.qiantong-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
  animation: glow-pulse 2s infinite;
  z-index: 1;
}

.qian-sticks {
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 1px;
}

.qian-stick {
  position: absolute;
  width: 70px;
  height: 5px;
  background: linear-gradient(90deg, #daa520, #ffd700, #daa520);
  border-radius: 3px;
  transform-origin: left center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.draw-hint {
  color: #00f0ff;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
  position: relative;
  z-index: 10;
}

.draw-subtitle {
  color: #bc13fe;
  font-size: 1rem;
  text-align: center;
  text-shadow: 0 0 8px rgba(188, 19, 254, 0.5);
  position: relative;
  z-index: 10;
}

.drawing-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.qiantong-wrapper {
  position: relative;
  margin-bottom: 30px;
  z-index: 5;
}

.qiantong-shaking {
  transform-origin: center bottom;
}

.floating-sticks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-stick {
  position: absolute;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #daa520, #ffd700, #daa520);
  border-radius: 2px;
  top: 50%;
  left: 50%;
  transform-origin: center;
  animation: float-up 3s ease-out forwards;
}

@keyframes float-up {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--index) * 40px - 80px), -200px) rotate(calc(var(--index) * 30deg));
    opacity: 0;
  }
}

.progress-container {
  width: 80%;
  text-align: center;
  position: relative;
  z-index: 10;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(8, 8, 16, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 15px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  transition: width 0.5s ease;
}

.progress-text {
  color: #00f0ff;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
  position: relative;
  z-index: 10;
}

.result-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.qian-card {
  width: 300px;
  background: linear-gradient(135deg, #1a1a3a, #2a2a4a);
  border: 2px solid #00f0ff;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.4);
  margin-bottom: 25px;
  padding: 25px;
  position: relative;
  overflow: hidden;
  z-index: 10;
}

.qian-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
}

.qian-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.qian-symbol {
  font-size: 3rem;
  color: #ffd700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  animation: float 3s ease-in-out infinite;
}

.qian-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff00ff;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.qian-title {
  font-size: 1.3rem;
  color: #00f0ff;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.qian-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #00f0ff, transparent);
  margin: 15px 0;
}

.qian-content {
  color: #ffff00;
  font-size: 1.1rem;
  line-height: 1.8;
  text-align: center;
  font-weight: 500;
  text-shadow: 0 0 5px rgba(255, 255, 0, 0.3);
}

.result-actions {
  display: flex;
  justify-content: center;
}

.cyber-button {
  padding: 15px 30px;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  color: #0c0c14;
  font-weight: bold;
  font-size: 1.1rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(188, 19, 254, 0.7);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 25px rgba(188, 19, 254, 0.9);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
}

.poem-section {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
}

.poem-card {
  background: linear-gradient(135deg, #1a1a3a, #2a2a4a);
  border: 2px solid #bc13fe;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 0 30px rgba(188, 19, 254, 0.5);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.poem-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #00f0ff, #bc13fe);
}

.poem-header {
  text-align: center;
  margin-bottom: 20px;
}

.poem-number {
  font-size: 1.3rem;
  color: #ff00ff;
  font-weight: bold;
  margin-bottom: 10px;
}

.poem-title {
  font-size: 1.5rem;
  color: #00f0ff;
  font-weight: bold;
}

.poem-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #bc13fe, transparent);
  margin: 20px 0;
}

.poem-content {
  color: #ffff00;
  font-size: 1.2rem;
  line-height: 2;
  text-align: center;
  margin-bottom: 25px;
  font-weight: 500;
  text-shadow: 0 0 8px rgba(255, 255, 0, 0.4);
}

.poem-explanation {
  color: #00f0ff;
  font-size: 1.1rem;
  line-height: 1.8;
  text-align: center;
  font-weight: 400;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
}

@keyframes glow-pulse {
  0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
  50% { box-shadow: 0 0 35px rgba(255, 215, 0, 0.9); }
  100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}
</style>
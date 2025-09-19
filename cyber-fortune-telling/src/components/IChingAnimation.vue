<template>
  <div class="iching-animation-container">
    <div class="coins-container" ref="coinsContainer">
      <!-- 投掷动画 -->
      <div v-if="isTossing" class="tossing-animation">
        <div class="hexagram-title">易经六爻占卜</div>
        
        <div 
          v-for="(coin, index) in coins" 
          :key="index"
          class="coin"
          :class="{ tossing: coin.isTossing, landed: coin.isLanded }"
          :style="getCoinStyle(index)"
        >
          <div class="coin-inner">
            <div class="coin-front">{{ coin.side === 'front' ? '正' : '反' }}</div>
            <div class="coin-back">{{ coin.side === 'front' ? '反' : '正' }}</div>
          </div>
        </div>
        
        <div class="toss-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <div class="progress-text">{{ tossProgressText }}</div>
        </div>
        
        <div class="yao-progress">
          <div class="yao-indicator" v-for="(yao, idx) in 6" :key="idx">
            <div class="yao-dot" :class="{ 
              'completed': idx < currentYao, 
              'current': idx === currentYao,
              'pending': idx > currentYao 
            }"></div>
            <div class="yao-label">{{ getYaoPosition(idx) }}</div>
          </div>
        </div>
      </div>
      
      <!-- 六爻结果展示 -->
      <div v-else-if="showHexagram" class="hexagram-result">
        <div class="result-header">
          <h2>卦象结果</h2>
          <div class="hexagram-number">第{{ hexagramNumber }}卦</div>
        </div>
        
        <div class="yao-container">
          <div 
            v-for="(yao, index) in yaoResults" 
            :key="index"
            class="yao-line"
            :class="getYaoClass(yao)"
          >
            <div class="yao-content">
              <div class="yao-symbol">{{ getYaoSymbol(yao) }}</div>
              <div class="yao-position">{{ getYaoPosition(index) }}</div>
            </div>
          </div>
        </div>
        
        <div class="hexagram-info">
          <div class="changing-info" v-if="changingLines.length > 0">
            变爻: {{ changingLines.length }}个
          </div>
        </div>
      </div>
      
      <!-- 开始按钮 -->
      <div v-else class="start-section">
        <div class="start-button" @click="startTossing">
          <div class="button-text">点击开始投币</div>
          <div class="button-subtext">六爻占卜</div>
        </div>
        <div class="toss-instruction">
          需要投掷三次硬币生成一爻，共六次生成六爻
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { gsap } from 'gsap'

interface Coin {
  side: 'front' | 'back'
  isTossing: boolean
  isLanded: boolean
}

interface YaoResult {
  type: 'yin' | 'yang'
  isChanging: boolean
}

const emit = defineEmits<{
  (e: 'complete', result: { yao: number[], changingLines: boolean[], hexagramNumber: number }): void
}>()

const isTossing = ref(false)
const showHexagram = ref(false)
const currentYao = ref(0)
const tossStep = ref(0)
const coins = ref<Coin[]>([])
const yaoResults = ref<YaoResult[]>([])
const hexagramNumber = ref(0)
const changingLines = ref<number[]>([])
const progressPercent = ref(0)

const tossProgressText = computed(() => {
  if (currentYao.value === 0 && tossStep.value === 0) return "准备投掷第一爻..."
  if (tossStep.value === 0) return `准备投掷第${currentYao.value + 1}爻...`
  return `第${currentYao.value + 1}爻第${tossStep.value}次投掷`
})

const getYaoClass = (yao: YaoResult) => {
  return {
    'yin-line': yao.type === 'yin',
    'yang-line': yao.type === 'yang',
    'changing': yao.isChanging
  }
}

const getYaoSymbol = (yao: YaoResult) => {
  if (yao.type === 'yang') {
    return yao.isChanging ? '━━━ ○' : '━━━━━'
  } else {
    return yao.isChanging ? '━ ━ ✕' : '━ ━ ━'
  }
}

const getYaoPosition = (index: number) => {
  const positions = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
  return positions[5 - index]
}

const getCoinStyle = (index: number) => {
  return {
    '--index': index,
    'animation-delay': `${index * 0.2}s`
  }
}

const startTossing = () => {
  isTossing.value = true
  currentYao.value = 0
  tossStep.value = 0
  yaoResults.value = []
  progressPercent.value = 0
  generateYao()
}

const generateYao = () => {
  if (currentYao.value < 6) {
    tossStep.value = 0
    // 更新进度
    progressPercent.value = (currentYao.value / 6) * 100
    tossCoins()
  } else {
    // 完成所有爻的生成
    progressPercent.value = 100
    calculateHexagram()
    showHexagram.value = true
    isTossing.value = false
    
    // 发送完成事件
    const yaoValues = yaoResults.value.map(yao => yao.type === 'yang' ? 2 : 3)
    const changingFlags = yaoResults.value.map(yao => yao.isChanging)
    
    setTimeout(() => {
      emit('complete', {
        yao: yaoValues,
        changingLines: changingFlags,
        hexagramNumber: hexagramNumber.value
      })
    }, 2000)
  }
}

const tossCoins = () => {
  if (tossStep.value < 3) {
    // 初始化硬币
    coins.value = Array.from({ length: 3 }, () => ({
      side: Math.random() > 0.5 ? 'front' : 'back',
      isTossing: true,
      isLanded: false
    }))
    
    // 模拟投掷动画
    setTimeout(() => {
      // 硬币落地
      coins.value.forEach(coin => {
        coin.isTossing = false
        coin.isLanded = true
      })
      
      tossStep.value++
      
      // 继续下一次投掷或生成爻
      setTimeout(() => {
        if (tossStep.value < 3) {
          tossCoins()
        } else {
          // 三次投掷完成，生成爻
          generateYaoResult()
        }
      }, 1000)
    }, 2000)
  }
}

const generateYaoResult = () => {
  // 计算爻的类型
  const frontCount = coins.value.filter(coin => coin.side === 'front').length
  const backCount = 3 - frontCount
  
  let yaoType: 'yin' | 'yang'
  let isChanging = false
  
  // 根据传统规则确定爻的类型
  if (frontCount === 3) {
    // 三正面为老阳爻（变爻）
    yaoType = 'yang'
    isChanging = true
  } else if (backCount === 3) {
    // 三反面为老阴爻（变爻）
    yaoType = 'yin'
    isChanging = true
  } else if (frontCount === 2) {
    // 两正面一反面为少阳爻（不变爻）
    yaoType = 'yang'
  } else {
    // 两反面一正面为少阴爻（不变爻）
    yaoType = 'yin'
  }
  
  yaoResults.value.push({
    type: yaoType,
    isChanging
  })
  
  if (isChanging) {
    changingLines.value.push(currentYao.value)
  }
  
  currentYao.value++
  
  // 继续生成下一个爻
  setTimeout(() => {
    generateYao()
  }, 1500)
}

const calculateHexagram = () => {
  // 计算卦象编号
  let binary = ""
  for (let i = 5; i >= 0; i--) {
    binary += yaoResults.value[i].type === 'yang' ? "1" : "0"
  }
  
  hexagramNumber.value = parseInt(binary, 2) + 1
}
</script>

<style scoped lang="scss">
.iching-animation-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.coins-container {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hexagram-title {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: #bc13fe;
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(188, 19, 254, 0.5);
}

.start-section {
  text-align: center;
}

.start-button {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #bc13fe, #00f0ff);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
  cursor: pointer;
  box-shadow: 0 0 30px rgba(188, 19, 254, 0.7);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(188, 19, 254, 0.9);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
}

.button-text {
  color: #0c0c14;
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
}

.button-subtext {
  color: #0c0c14;
  font-size: 1rem;
  text-align: center;
  opacity: 0.8;
}

.toss-instruction {
  color: #00f0ff;
  font-size: 0.9rem;
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.5);
}

.tossing-animation {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.coin {
  width: 60px;
  height: 60px;
  position: absolute;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  
  &.tossing {
    animation: toss 1.5s ease-in-out infinite;
  }
  &.landed {
    animation: land 0.8s ease-out forwards;
  }
}

.coin-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s;
}

.coin-front, .coin-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.coin-front {
  background: linear-gradient(135deg, #ffd700, #ffa500);
  color: #8b4513;
  transform: rotateY(0deg);
  border: 2px solid #daa520;
}

.coin-back {
  background: linear-gradient(135deg, #c0c0c0, #a9a9a9);
  color: #2f4f4f;
  border: 2px solid #696969;
  transform: rotateY(180deg);
}

@keyframes toss {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  25% { transform: translate(-50%, -50%) rotate(180deg) translateY(-80px); }
  50% { transform: translate(-50%, -50%) rotate(360deg) translateY(0); }
  75% { transform: translate(-50%, -50%) rotate(540deg) translateY(-40px); }
  100% { transform: translate(-50%, -50%) rotate(720deg); }
}

@keyframes land {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.toss-progress {
  position: absolute;
  bottom: 100px;
  left: 0;
  right: 0;
  text-align: center;
  width: 80%;
  margin: 0 auto;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(8, 8, 16, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  transition: width 0.5s ease;
}

.progress-text {
  color: #00f0ff;
  font-size: 1.1rem;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.yao-progress {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.yao-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.yao-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-bottom: 5px;
  background: #333;
  border: 1px solid #666;
  
  &.completed {
    background: #00f0ff;
    box-shadow: 0 0 8px rgba(0, 240, 255, 0.7);
  }
  
  &.current {
    background: #bc13fe;
    box-shadow: 0 0 12px rgba(188, 19, 254, 0.9);
    animation: pulse 1.5s infinite;
  }
  
  &.pending {
    background: #333;
  }
}

@keyframes pulse {
  0% { box-shadow: 0 0 8px rgba(188, 19, 254, 0.7); }
  50% { box-shadow: 0 0 15px rgba(188, 19, 254, 0.9); }
  100% { box-shadow: 0 0 8px rgba(188, 19, 254, 0.7); }
}

.yao-label {
  font-size: 0.7rem;
  color: #00f0ff;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.5);
}

.hexagram-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.result-header {
  text-align: center;
  margin-bottom: 20px;
}

.result-header h2 {
  color: #bc13fe;
  font-size: 2rem;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(188, 19, 254, 0.5);
}

.yao-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  gap: 8px;
}

.yao-line {
  width: 220px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
  
  &.yang-line {
    background: rgba(188, 19, 254, 0.2);
    border: 1px solid #bc13fe;
  }
  
  &.yin-line {
    background: rgba(0, 240, 255, 0.2);
    border: 1px solid #00f0ff;
  }
  
  &.changing {
    box-shadow: 0 0 20px rgba(255, 255, 0, 0.7);
    animation: pulse 2s infinite;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.yao-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.yao-symbol {
  font-size: 1.4rem;
  font-weight: bold;
  color: #ff00ff;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
}

.yao-position {
  font-size: 1rem;
  color: #00f0ff;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.5);
}

.hexagram-info {
  text-align: center;
  color: #00f0ff;
}

.hexagram-number {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 15px;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(188, 19, 254, 0.5);
}

.changing-info {
  font-size: 1.1rem;
  color: #ffff00;
  text-shadow: 0 0 10px rgba(255, 255, 0, 0.7);
}
</style>
```

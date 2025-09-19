<template>
  <div class="plumflower-animation-container">
    <div class="plumflower-content">
      <!-- 输入数字 -->
      <div v-if="!isCalculating" class="input-section">
        <h3>梅花易数</h3>
        <p>请输入数字进行算卦</p>
        
        <div class="number-inputs">
          <div class="input-group">
            <label for="number1">第一个数字</label>
            <div class="custom-number-input">
              <button 
                class="number-btn decrement" 
                @click="decrementNumber('first')"
                :disabled="isFirstNumberMin"
              >
                -
              </button>
              <input 
                id="number1" 
                type="number" 
                v-model="firstNumber" 
                min="1" 
                max="9999"
                placeholder="1-9999"
                @input="validateInput('first', $event)"
                class="number-input"
              />
              <button 
                class="number-btn increment" 
                @click="incrementNumber('first')"
                :disabled="isFirstNumberMax"
              >
                +
              </button>
            </div>
          </div>
          
          <div class="input-group">
            <label for="number2">第二个数字</label>
            <div class="custom-number-input">
              <button 
                class="number-btn decrement" 
                @click="decrementNumber('second')"
                :disabled="isSecondNumberMin"
              >
                -
              </button>
              <input 
                id="number2" 
                type="number" 
                v-model="secondNumber" 
                min="1" 
                max="9999"
                placeholder="1-9999"
                @input="validateInput('second', $event)"
                class="number-input"
              />
              <button 
                class="number-btn increment" 
                @click="incrementNumber('second')"
                :disabled="isSecondNumberMax"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <button class="cyber-button" @click="startCalculation" :disabled="!canCalculate">
          开始计算
        </button>
      </div>
      
      <!-- 计算动画 -->
      <div v-else class="calculation-animation">
        <div class="hexagram-display">
          <div class="upper-trigram">
            <div 
              v-for="(yao, index) in upperYao" 
              :key="index"
              class="yao-line"
              :class="getYaoClass(yao)"
            >
              <div class="yao-symbol">{{ getYaoSymbol(yao) }}</div>
            </div>
          </div>
          
          <div class="lower-trigram">
            <div 
              v-for="(yao, index) in lowerYao" 
              :key="index"
              class="yao-line"
              :class="getYaoClass(yao)"
            >
              <div class="yao-symbol">{{ getYaoSymbol(yao) }}</div>
            </div>
          </div>
        </div>
        
        <div class="calculation-progress">
          <div class="progress-text">{{ progressText }}</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  (e: 'complete', result: { upperYao: number[], lowerYao: number[], hexagramNumber: number }): void
}>()

const firstNumber = ref<number | null>(null)
const secondNumber = ref<number | null>(null)
const isCalculating = ref(false)
const progressPercent = ref(0)
const upperYao = ref<number[]>([])
const lowerYao = ref<number[]>([])
const currentStep = ref(0)

// 计算属性用于按钮禁用状态
const isFirstNumberMin = computed(() => {
  return firstNumber.value === null || firstNumber.value <= 1
})

const isFirstNumberMax = computed(() => {
  return firstNumber.value !== null && firstNumber.value >= 9999
})

const isSecondNumberMin = computed(() => {
  return secondNumber.value === null || secondNumber.value <= 1
})

const isSecondNumberMax = computed(() => {
  return secondNumber.value !== null && secondNumber.value >= 9999
})

const canCalculate = computed(() => {
  return firstNumber.value !== null && 
         secondNumber.value !== null && 
         firstNumber.value > 0 && 
         secondNumber.value > 0 &&
         firstNumber.value <= 9999 &&
         secondNumber.value <= 9999
})

const progressText = computed(() => {
  if (currentStep.value === 0) return "分析第一个数字..."
  if (currentStep.value === 1) return "分析第二个数字..."
  if (currentStep.value === 2) return "生成上卦..."
  if (currentStep.value === 3) return "生成下卦..."
  if (currentStep.value === 4) return "计算卦象..."
  return "完成!"
})

const getYaoClass = (yao: number) => {
  return {
    'yin-line': yao === 0,
    'yang-line': yao === 1
  }
}

const getYaoSymbol = (yao: number) => {
  return yao === 1 ? '━━━━━' : '━ ━ ━'
}

const incrementNumber = (type: 'first' | 'second') => {
  if (type === 'first') {
    if (firstNumber.value === null) {
      firstNumber.value = 1
    } else if (firstNumber.value < 9999) {
      firstNumber.value++
    }
  } else {
    if (secondNumber.value === null) {
      secondNumber.value = 1
    } else if (secondNumber.value < 9999) {
      secondNumber.value++
    }
  }
}

const decrementNumber = (type: 'first' | 'second') => {
  if (type === 'first') {
    if (firstNumber.value === null || firstNumber.value <= 1) {
      firstNumber.value = 1
    } else {
      firstNumber.value--
    }
  } else {
    if (secondNumber.value === null || secondNumber.value <= 1) {
      secondNumber.value = 1
    } else {
      secondNumber.value--
    }
  }
}

const validateInput = (type: 'first' | 'second', event: Event) => {
  const input = event.target as HTMLInputElement
  const value = parseInt(input.value)
  
  if (isNaN(value) || value < 1) {
    input.value = '1'
    if (type === 'first') {
      firstNumber.value = 1
    } else {
      secondNumber.value = 1
    }
  } else if (value > 9999) {
    input.value = '9999'
    if (type === 'first') {
      firstNumber.value = 9999
    } else {
      secondNumber.value = 9999
    }
  } else {
    if (type === 'first') {
      firstNumber.value = value
    } else {
      secondNumber.value = value
    }
  }
}

const startCalculation = () => {
  if (!canCalculate.value) return
  
  isCalculating.value = true
  progressPercent.value = 0
  currentStep.value = 0
  upperYao.value = []
  lowerYao.value = []
  
  // 开始计算过程
  calculateStep()
}

const calculateStep = () => {
  // 使用循环替代递归调用，避免卡死
  const processSteps = async () => {
    for (let step = 0; step <= 4; step++) {
      currentStep.value = step
      progressPercent.value = (step / 4) * 100
      
      switch (step) {
        case 0:
          // 分析第一个数字
          break
        case 1:
          // 分析第二个数字
          break
        case 2:
          // 生成上卦
          generateUpperTrigram()
          break
        case 3:
          // 生成下卦
          generateLowerTrigram()
          break
        case 4:
          // 计算卦象
          completeCalculation()
          break
      }
      
      // 等待动画完成再继续
      await new Promise(resolve => setTimeout(resolve, 800))
    }
  }
  
  processSteps()
}

const generateUpperTrigram = () => {
  if (firstNumber.value === null) return
  
  // 根据第一个数字生成上卦的三个爻
  const remainder1 = firstNumber.value % 3
  const remainder2 = Math.floor(firstNumber.value / 10) % 3
  const remainder3 = Math.floor(firstNumber.value / 100) % 3
  
  upperYao.value = [
    remainder1 === 0 ? 1 : 0,
    remainder2 === 0 ? 1 : 0,
    remainder3 === 0 ? 1 : 0
  ]
}

const generateLowerTrigram = () => {
  if (secondNumber.value === null) return
  
  // 根据第二个数字生成下卦的三个爻
  const remainder1 = secondNumber.value % 3
  const remainder2 = Math.floor(secondNumber.value / 10) % 3
  const remainder3 = Math.floor(secondNumber.value / 100) % 3
  
  lowerYao.value = [
    remainder1 === 0 ? 1 : 0,
    remainder2 === 0 ? 1 : 0,
    remainder3 === 0 ? 1 : 0
  ]
}

const completeCalculation = () => {
  // 计算卦象编号
  const upperBinary = upperYao.value.map(y => y.toString()).join('')
  const lowerBinary = lowerYao.value.map(y => y.toString()).join('')
  const hexagramBinary = upperBinary + lowerBinary
  const hexagramNumber = parseInt(hexagramBinary, 2) + 1
  
  // 发送完成事件
  setTimeout(() => {
    emit('complete', {
      upperYao: upperYao.value,
      lowerYao: lowerYao.value,
      hexagramNumber: hexagramNumber
    })
  }, 1000)
}
</script>

<style scoped lang="scss">
.plumflower-animation-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.plumflower-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.input-section {
  text-align: center;
  padding: 2rem;
}

.input-section h3 {
  color: #bc13fe;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(188, 19, 254, 0.5);
}

.input-section p {
  color: #00f0ff;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.number-inputs {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group label {
  color: #ff00ff;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.custom-number-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.number-input {
  width: 100px;
  padding: 0.8rem;
  text-align: center;
  font-size: 1.1rem;
  background: rgba(8, 8, 16, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 5px;
  color: #00f0ff;
  
  /* 隐藏浏览器默认的数字输入框上下箭头 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
}

.number-input:focus {
  outline: none;
  border-color: #00f0ff;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
}

.number-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #bc13fe, #00f0ff);
  color: #0c0c14;
  border: none;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(188, 19, 254, 0.5);
  
  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(188, 19, 254, 0.8);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  &.increment {
    background: linear-gradient(135deg, #00f0ff, #bc13fe);
  }
}

.cyber-button {
  padding: 12px 30px;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  color: #0c0c14;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(188, 19, 254, 0.5);
  font-size: 1.1rem;
}

.cyber-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(188, 19, 254, 0.8);
}

.cyber-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.calculation-animation {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hexagram-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.upper-trigram, .lower-trigram {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.yao-line {
  width: 180px;
  padding: 0.5rem;
  border-radius: 5px;
  text-align: center;
  transition: all 0.3s ease;
  
  &.yang-line {
    background: rgba(188, 19, 254, 0.2);
    border: 1px solid #bc13fe;
  }
  
  &.yin-line {
    background: rgba(0, 240, 255, 0.2);
    border: 1px solid #00f0ff;
  }
}

.yao-symbol {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff00ff;
}

.calculation-progress {
  width: 80%;
  text-align: center;
}

.progress-text {
  color: #00f0ff;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(8, 8, 16, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  transition: width 0.5s ease;
}
</style>
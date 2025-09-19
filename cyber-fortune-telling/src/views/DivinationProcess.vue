<template>
  <div class="divination-process">
    <div class="cyber-header">
      <h1 class="cyber-title">{{ currentDivination?.name }}</h1>
      <p class="cyber-subtitle">{{ currentDivination?.process }}</p>
    </div>
    
    <div class="content">
      <div class="process-container">
        <!-- 算卦动画区域 -->
        <div class="animation-area" ref="animationArea">
          <div v-if="!isProcessing" class="start-prompt">
            <p>准备开始算卦...</p>
            <button class="cyber-button" @click="startDivination">
              开始算卦
            </button>
            <button class="cyber-button secondary" @click="goHome" style="margin-left: 1rem;">
              返回主页
            </button>
          </div>
          
          <div v-else class="processing">
            <!-- 根据算卦类型显示不同的动画 -->
            <div v-if="typeId === 'tarot'" class="tarot-animation">
              <EnhancedTarotCardAnimation 
                :card-count="3" 
                :enable-enhanced-animation="true"
                :particle-effects="true"
                animation-speed="normal"
                @complete="onTarotComplete"
                @animationStart="handleAnimationStart"
                @animationComplete="handleAnimationComplete"
                @particleComplete="handleParticleComplete"
              />
            </div>
            
            <div v-else-if="typeId === 'iChing'" class="iching-animation">
              <IChingAnimation @complete="onIChingComplete" />
            </div>
            
            <div v-else-if="typeId === 'qianShi'" class="qianshi-animation">
              <QianShiAnimation @complete="onQianShiComplete" />
            </div>
            
            <div v-else-if="typeId === 'plumFlower'" class="plumflower-animation">
              <PlumFlowerAnimation @complete="onPlumFlowerComplete" />
            </div>
            
            <!-- 默认3D动画 -->
            <Cyber3DAnimation v-else />
            
            <div class="progress-info" v-if="typeId !== 'tarot' && typeId !== 'iChing' && typeId !== 'qianShi' && typeId !== 'plumFlower'">
              <p>正在计算中...</p>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
              <p class="progress-text">{{ Math.round(progress) }}%</p>
            </div>
          </div>
        </div>
        
        <!-- 用户问题输入 -->
        <div class="question-input">
          <label for="question">您的问题：</label>
          <textarea 
            id="question" 
            v-model="userQuestion" 
            placeholder="请输入您想算卦的问题（可选）"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDivinationStore } from '../store/divination'
import { gsap } from 'gsap'
import Cyber3DAnimation from '../components/Cyber3DAnimation.vue'
import TarotCardAnimation from '../components/TarotCardAnimation.vue'
import EnhancedTarotCardAnimation from '../components/EnhancedTarotCardAnimation.vue'
import IChingAnimation from '../components/IChingAnimation.vue'
import QianShiAnimation from '../components/QianShiAnimation.vue'
import PlumFlowerAnimation from '../components/PlumFlowerAnimation.vue'

const route = useRoute()
const router = useRouter()
const store = useDivinationStore()

// 添加对路由参数变化的监听
const typeId = computed(() => route.params.type as string)
const userQuestion = ref('')
const isProcessing = ref(false)
const progress = ref(0)
const animationArea = ref<HTMLElement | null>(null)
const divinationResult = ref<any>(null)
const divinationDetails = ref<any>(null)

// 监听路由参数变化
watch(() => route.params.type, (newType) => {
  if (!newType) {
    // 如果没有type参数，重定向到选择页面
    router.push('/divination')
  }
})

const currentDivination = computed(() => {
  // 添加检查确保typeId存在
  if (!typeId.value) {
    return null
  }
  return store.getDivinationTypeById(typeId.value)
})

const startDivination = () => {
  // 检查typeId是否存在
  if (!typeId.value) {
    router.push('/divination')
    return
  }
  
  isProcessing.value = true
  progress.value = 0
  divinationResult.value = null
  divinationDetails.value = null
  
  // 对于没有专门动画的算卦类型，使用默认进度条
  if (typeId.value !== 'tarot' && typeId.value !== 'iChing' && typeId.value !== 'qianShi' && typeId.value !== 'plumFlower') {
    // 模拟进度条动画
    const progressInterval = setInterval(() => {
      progress.value += Math.random() * 10
      if (progress.value >= 100) {
        progress.value = 100
        clearInterval(progressInterval)
      }
    }, 200)
    
    // 模拟算卦过程（实际项目中这里会调用相应的算法）
    setTimeout(() => {
      clearInterval(progressInterval)
      completeDivination()
    }, 5000)
  }
}

const onTarotComplete = (cards: {number: number, suit: number}[]) => {
  divinationResult.value = {
    cards: cards
  }
  setTimeout(() => {
    completeDivination()
  }, 2000)
}

// 增强版塔罗牌动画事件处理
const handleAnimationStart = () => {
  console.log('塔罗牌动画开始')
}

const handleAnimationComplete = () => {
  console.log('塔罗牌动画完成')
}

const handleParticleComplete = () => {
  console.log('粒子效果完成')
}

const onIChingComplete = (result: { yao: number[], changingLines: boolean[], hexagramNumber: number }) => {
  divinationResult.value = {
    hexagram: result.hexagramNumber,
    changingLines: result.changingLines
  }
  
  // 保存详细信息
  divinationDetails.value = {
    yao: result.yao,
    changingLines: result.changingLines
  }
  
  setTimeout(() => {
    completeDivination()
  }, 2000)
}

const onQianShiComplete = (qianNumber: number) => {
  divinationResult.value = {
    signNumber: qianNumber
  }
  setTimeout(() => {
    completeDivination()
  }, 2000)
}

const onPlumFlowerComplete = (result: { upperYao: number[], lowerYao: number[], hexagramNumber: number }) => {
  divinationResult.value = {
    upperYao: result.upperYao,
    lowerYao: result.lowerYao,
    hexagram: result.hexagramNumber
  }
  setTimeout(() => {
    completeDivination()
  }, 2000)
}

const completeDivination = () => {
  // 检查typeId是否存在
  if (!typeId.value) {
    router.push('/divination')
    return
  }
  
  // 生成模拟结果
  const result = {
    id: Date.now().toString(),
    type: typeId.value,
    question: userQuestion.value,
    result: divinationResult.value || generateResult(typeId.value),
    timestamp: Date.now(),
    interpretation: generateInterpretation(typeId.value),
    details: divinationDetails.value || {}
  }
  
  // 保存结果到store
  store.setResult(result)
  
  // 跳转到结果页面
  router.push(`/divination/${typeId.value}/result`)
}

const generateResult = (type: string) => {
  // 根据不同算卦类型生成不同的结果
  switch (type) {
    case 'iChing':
      return {
        hexagram: Math.floor(Math.random() * 64) + 1,
        changingLines: [Math.random() > 0.5, Math.random() > 0.5, Math.random() > 0.5, 
                       Math.random() > 0.5, Math.random() > 0.5, Math.random() > 0.5]
      }
    case 'tarot':
      return {
        cards: Array.from({ length: 3 }, () => ({
          number: Math.floor(Math.random() * 78) + 1,
          suit: Math.floor(Math.random() * 4)
        }))
      }
    case 'qianShi':
      return {
        signNumber: Math.floor(Math.random() * 100) + 1
      }
    case 'plumFlower':
      // 梅花易数结果
      const upperYao = Array.from({ length: 3 }, () => Math.floor(Math.random() * 2))
      const lowerYao = Array.from({ length: 3 }, () => Math.floor(Math.random() * 2))
      return {
        upperYao,
        lowerYao,
        hexagram: Math.floor(Math.random() * 64) + 1
      }
    default:
      return { data: 'result' }
  }
}

const generateInterpretation = (type: string) => {
  const interpretations = [
    "这是一个积极的征象，预示着成功和好运即将到来。保持积极的心态，机会就在眼前。",
    "需要保持耐心，时机成熟时自然会有所收获。不要急躁，顺应自然的节奏。",
    "建议您多关注内心的声音，答案就在您心中。静下心来思考，您会找到方向。",
    "这是一个转折点，需要做出重要的决定。仔细权衡利弊，相信您的直觉。",
    "保持积极的心态，困难只是暂时的。坚持下去，光明就在前方。",
    "这是一个提醒，要注意身边的细节。小事情可能会带来大的转机。",
    "建议您多与他人交流，分享您的想法。合作会带来意想不到的收获。",
    "当前的状况需要您保持冷静和理智。避免冲动行事，三思而后行。",
    "这是一个需要勇气面对挑战的时期。相信自己的能力，您能够克服困难。"
  ]
  
  return interpretations[Math.floor(Math.random() * interpretations.length)]
}

const goHome = () => {
  router.push('/divination')
}

onMounted(() => {
  if (animationArea.value) {
    // 初始化动画效果
    gsap.from(animationArea.value, {
      duration: 1,
      opacity: 0,
      y: 50,
      ease: "power2.out"
    })
  }
})
</script>

<style scoped lang="scss">
.divination-process {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.cyber-header {
  text-align: center;
  margin-bottom: 2rem;
}

.content {
  display: flex;
  justify-content: center;
}

.process-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.animation-area {
  width: 100%;
  min-height: 400px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.start-prompt {
  text-align: center;
  padding: 2rem;
}

.start-prompt p {
  font-size: 1.2rem;
  color: #00f0ff;
  margin-bottom: 2rem;
}

.processing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.tarot-animation, .iching-animation, .qianshi-animation, .plumflower-animation {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}

.qianshi-animation {
  width: 100%;
  height: 550px; /* 增加高度以提供更多空间 */
  margin-bottom: 20px;
}

.progress-info {
  text-align: center;
  margin-top: 2rem;
  width: 80%;
}

.progress-info p {
  color: #00f0ff;
  font-size: 1.2rem;
  margin-bottom: 1rem;
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
  transition: width 0.3s ease;
}

.progress-text {
  color: #ff00ff;
  font-weight: bold;
}

.question-input {
  width: 100%;
  max-width: 600px;
}

.question-input label {
  display: block;
  margin-bottom: 0.5rem;
  color: #00f0ff;
  font-weight: bold;
}

.question-input textarea {
  width: 100%;
  min-height: 100px;
  background: rgba(8, 8, 16, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 5px;
  padding: 1rem;
  color: #00f0ff;
  font-family: inherit;
  resize: vertical;
}

.question-input textarea:focus {
  outline: none;
  border-color: #00f0ff;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
}

@media (max-width: 768px) {
  .divination-process {
    padding: 1rem;
  }
  
  .tarot-animation, .iching-animation, .qianshi-animation, .plumflower-animation {
    height: 350px;
  }
  
  .animation-area {
    min-height: 350px;
  }
}
</style>
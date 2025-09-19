<template>
  <div class="tarot-animation-container">
    <div class="cards-container" ref="cardsContainer">
      <!-- 牌堆 -->
      <div 
        v-if="!isDealing" 
        class="card-pile" 
        @click="startDeal"
        :class="{ 'enhanced': enableEnhancedAnimation }"
      >
        <div 
          class="card-back" 
          v-for="n in 5" 
          :key="n" 
          :style="{ 
            zIndex: n, 
            transform: `translate(${(n-3)*2}px, ${(n-3)*2}px) rotate(${(n-3)*5}deg)` 
          }"
        ></div>
        <div class="click-hint">点击开始抽牌</div>
      </div>
      
      <!-- 抽牌动画 -->
      <div v-else class="dealing-animation">
        <!-- 牌堆（剩余的牌） -->
        <div class="remaining-cards" v-if="remainingCards > 0">
          <div 
            class="card-back" 
            v-for="n in Math.min(remainingCards, 3)" 
            :key="n" 
            :style="{ zIndex: n }"
          ></div>
        </div>
        
        <div 
          v-for="(card, index) in dealtCards" 
          :key="index"
          class="tarot-card"
          :class="{
            dealt: card.isDealt, 
            revealed: card.isRevealed, 
            'in-deck': !card.isDealt,
            'enhanced': enableEnhancedAnimation,
            'rotating': isRotating && index < currentDealStep
          }"
          :style="getCardStyle(index)"
          ref="cardElements"
        >
          <div class="card-front" v-if="card.isRevealed">
            <div class="card-symbol">{{ getCardSymbol(card.suit) }}</div>
            <div class="card-name">{{ getCardName(card.number, card.suit) }}</div>
            <div class="card-number">{{ card.number }}</div>
          </div>
          <div class="card-back" v-else></div>
        </div>
        
        <div class="progress-text" v-if="isDealing">
          {{ dealProgressText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { AnimationController } from '../utils/animations/animationController'

interface Card {
  number: number
  suit: number  // -1: 大阿卡纳, 0: clubs, 1: diamonds, 2: hearts, 3: spades
  isDealt: boolean
  isRevealed: boolean
}

// 新增属性
const props = defineProps<{
  cardCount?: number
  enableEnhancedAnimation?: boolean  // 是否启用增强动画
  particleEffects?: boolean         // 是否启用粒子效果
  animationSpeed?: 'slow' | 'normal' | 'fast'  // 动画速度
}>()

const emit = defineEmits<{
  (e: 'complete', cards: {number: number, suit: number}[]): void
  (e: 'animationStart'): void
  (e: 'animationComplete'): void
  (e: 'particleComplete'): void
}>()

// 响应式数据
const cardCount = props.cardCount || 3
const isDealing = ref(false)
const dealtCards = ref<Card[]>([])
const currentDealStep = ref(0)
const totalCards = ref(78)  // 塔罗牌总数
const cardsContainer = ref<HTMLElement | null>(null)
const cardElements = ref<HTMLElement[]>([])
const allCards = ref<Card[]>([]) // 存储所有洗好的牌
const isRotating = ref(false)
const animationController = ref<AnimationController | null>(null)

// 计算属性
const remainingCards = computed(() => {
  return Math.max(0, totalCards.value - currentDealStep.value)
})

const dealProgressText = computed(() => {
  if (currentDealStep.value === 0) return "洗牌中..."
  if (currentDealStep.value <= cardCount.value) return `抽取第${currentDealStep.value}张牌...`
  if (currentDealStep.value === cardCount.value + 1) return "翻牌中..."
  return "完成!"
})

// 动画速度映射
const animationSpeedMap = {
  slow: 1.5,
  normal: 1,
  fast: 0.7
}

const currentSpeed = computed(() => {
  return animationSpeedMap[props.animationSpeed || 'normal']
})

// 获取花色符号
const getCardSymbol = (suit: number) => {
  // 大阿卡纳牌没有花色
  if (suit === -1) return "★"
  const symbols = ['♣', '♦', '♥', '♠']
  return symbols[suit]
}

// 获取卡牌名称
const getCardName = (number: number, suit: number) => {
  // 大阿卡纳牌 (suit = -1)
  if (suit === -1) {
    const majorArcana = [
      "愚者", "魔术师", "女祭司", "皇后", "皇帝", "教皇", "恋人",
      "战车", "力量", "隐者", "命运之轮", "正义", "倒吊人", "死神",
      "节制", "恶魔", "塔", "星星", "月亮", "太阳", "审判", "世界"
    ]
    return majorArcana[number] || `大阿卡纳${number}`
  }
  
  // 小阿卡纳牌
  if (number === 1) return "A"
  if (number > 1 && number <= 10) return number.toString()
  const names = ["J", "Q", "K"]
  return names[number - 11] || number.toString()
}

// 获取卡牌样式
const getCardStyle = (index: number) => {
  const baseStyle = {
    '--index': index
  } as any
  
  if (dealtCards.value[index]?.isDealt) {
    // 已经抽出的牌的位置
    baseStyle.transform = `translate(${(index - 1) * 150 + 50}px, -100px) rotate(${(index - 1) * 15}deg)`
  } else if (!dealtCards.value[index]?.isDealt && isDealing.value) {
    // 还在牌堆中的牌
    baseStyle.transform = `translate(0, 0) rotate(0deg)`
  }
  
  return baseStyle
}

// 洗牌动画
const shuffleAnimation = async () => {
  if (!cardsContainer.value || !props.enableEnhancedAnimation) return
  
  // 初始化动画控制器
  animationController.value = new AnimationController(cardsContainer.value)
  
  // 执行洗牌动画
  await animationController.value.shuffleAnimation(1.5 * currentSpeed.value)
}

// 抽牌动画
const drawCardAnimation = async (index: number) => {
  if (!cardsContainer.value) return
  
  // 等待DOM更新
  await nextTick()
  
  const cardElement = cardElements.value[index]
  if (!cardElement) return
  
  // 确保动画控制器已初始化
  if (!animationController.value) {
    animationController.value = new AnimationController(cardsContainer.value)
  }
  
  // 执行抽牌动画
  await animationController.value.drawCardAnimation(
    cardElement,
    (index - 1) * 150 + 50,
    -100,
    (index - 1) * 15,
    0.8 * currentSpeed.value
  )
}

// 翻牌动画
const flipCardAnimation = async (index: number) => {
  if (!cardsContainer.value) return
  
  // 等待DOM更新
  await nextTick()
  
  const cardElement = cardElements.value[index]
  if (!cardElement) return
  
  // 确保动画控制器已初始化
  if (!animationController.value) {
    animationController.value = new AnimationController(cardsContainer.value)
  }
  
  // 执行翻牌动画
  await animationController.value.flipCardAnimation(
    cardElement,
    0.8 * currentSpeed.value
  )
}

// 开始抽牌
const startDeal = async () => {
  isDealing.value = true
  currentDealStep.value = 0
  dealtCards.value = []
  isRotating.value = true
  
  emit('animationStart')
  
  // 初始化卡片数据 (完整的78张塔罗牌)
  const cards: Card[] = []
  // 大阿卡纳 (22张)
  for (let i = 0; i < 22; i++) {
    cards.push({
      number: i,
      suit: -1, // 大阿卡纳牌没有花色
      isDealt: false,
      isRevealed: false
    })
  }
  // 小阿卡纳 (56张)
  for (let suit = 0; suit < 4; suit++) {
    for (let number = 1; number <= 14; number++) {
      cards.push({
        number: number,
        suit: suit,
        isDealt: false,
        isRevealed: false
      })
    }
  }
  
  // 随机洗牌
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]
  }
  
  // 保存洗好的牌
  allCards.value = cards
  
  // 初始化要抽取的牌（只显示要抽取的牌数）
  dealtCards.value = Array(cardCount.value).fill(null).map(() => ({
    number: 0,
    suit: -1,
    isDealt: false,
    isRevealed: false
  }))
  
  // 开始洗牌动画
  await shuffleAnimation()
  isRotating.value = false
  
  // 逐张抽牌
  for (let i = 0; i < cardCount.value; i++) {
    // 从洗好的牌中取出一张
    const card = allCards.value[i]
    
    // 更新显示的牌
    dealtCards.value[i] = {
      ...card,
      isDealt: true,
      isRevealed: false
    }
    
    currentDealStep.value = i + 1
    
    // 执行抽牌动画
    await drawCardAnimation(i)
  }
  
  // 翻牌
  currentDealStep.value = cardCount.value + 1
  await new Promise(resolve => setTimeout(resolve, 500 * currentSpeed.value))
  
  // 逐张翻牌
  for (let i = 0; i < cardCount.value; i++) {
    dealtCards.value[i].isRevealed = true
    
    // 执行翻牌动画
    await flipCardAnimation(i)
  }
  
  currentDealStep.value = cardCount.value + 2
  
  // 等待DOM更新后再执行完成动画
  await nextTick()
  
  // 执行完成动画
  if (animationController.value && cardElements.value.length > 0) {
    // 过滤出已处理的卡片元素
    const processedCards = cardElements.value.slice(0, cardCount.value)
    await animationController.value.completeAnimation(processedCards)
    emit('particleComplete')
  }
  
  const cardResults = dealtCards.value.map(card => ({
    number: card.number,
    suit: card.suit
  }))
  
  emit('animationComplete')
  emit('complete', cardResults)
}

// 组件卸载时清理
onUnmounted(() => {
  if (animationController.value) {
    animationController.value.destroy()
  }
})
</script>

<style scoped lang="scss">
.tarot-animation-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  perspective: 1000px;
}

.cards-container {
  position: relative;
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-pile {
  position: relative;
  cursor: pointer;
  perspective: 1000px;
  transform-style: preserve-3d;
  margin-bottom: 50px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &.enhanced {
    .card-back {
      background: linear-gradient(135deg, #8a2be2, #4b0082, #9932cc);
      box-shadow: 0 0 15px rgba(188, 19, 254, 0.7);
    }
  }
}

.card-back {
  width: 80px;
  height: 120px;
  background: linear-gradient(135deg, #8a2be2, #4b0082);
  border-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  
  &::before {
    content: "";
    width: 60px;
    height: 100px;
    border: 2px solid rgba(255, 255, 255, 0.7);
    border-radius: 5px;
  }
  
  &:nth-child(1) { transform: rotate(-5deg); }
  &:nth-child(2) { transform: rotate(0deg); }
  &:nth-child(3) { transform: rotate(5deg); }
  &:nth-child(4) { transform: rotate(-2deg); }
  &:nth-child(5) { transform: rotate(2deg); }
}

// 增强版卡牌背面样式
.card-back.enhanced {
  background: linear-gradient(135deg, #8a2be2, #4b0082, #9932cc);
  box-shadow: 0 0 20px rgba(188, 19, 254, 0.8);
  border: 2px solid #fff;
  animation: cardShine 3s infinite;
  
  &::before {
    border: 2px solid rgba(255, 255, 255, 0.9);
    animation: innerShine 2s infinite;
  }
  
  &::after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 8px;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shineMove 3s infinite;
    z-index: -1;
  }
}

.card-front {
  background: linear-gradient(135deg, #f8f8ff, #e6e6fa);
  border: 2px solid #4b0082;
  transform: rotateY(180deg);
  color: #000;
  padding: 5px;
  /* 添加金属质感边框 */
  &::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border: 1px solid rgba(75, 0, 130, 0.3);
    border-radius: 5px;
    pointer-events: none;
  }
}

// 增强版卡牌正面样式
.card-front.enhanced {
  background: linear-gradient(135deg, #f8f8ff, #e6e6fa, #ffffff);
  border: 2px solid #4b0082;
  box-shadow: 0 0 15px rgba(75, 0, 130, 0.5);
  
  &::before {
    border: 1px solid rgba(75, 0, 130, 0.5);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    border-radius: 8px;
    animation: cardGlow 4s infinite;
    pointer-events: none;
  }
}

.card-symbol {
  font-size: 2rem;
  margin-bottom: 5px;
  color: #4b0082;
  text-shadow: 0 0 5px rgba(75, 0, 130, 0.3);
}

.card-name {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #4b0082;
  text-align: center;
  text-shadow: 0 0 3px rgba(75, 0, 130, 0.2);
}

.card-number {
  font-size: 1rem;
  font-weight: bold;
  color: #4b0082;
  text-shadow: 0 0 3px rgba(75, 0, 130, 0.2);
}

.tarot-card {
  width: 80px;
  height: 120px;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  transform-origin: center;
  
  &.in-deck {
    transform: translate(0, 0) rotate(0deg);
  }
  
  &.dealt {
    transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  &.enhanced {
    .card-back {
      background: linear-gradient(135deg, #8a2be2, #4b0082, #9932cc);
      box-shadow: 0 0 15px rgba(188, 19, 254, 0.7);
      border: 2px solid #fff;
      
      &::before {
        border: 2px solid rgba(255, 255, 255, 0.9);
      }
    }
    
    .card-front {
      background: linear-gradient(135deg, #f8f8ff, #e6e6fa, #ffffff);
      border: 2px solid #4b0082;
      box-shadow: 0 0 15px rgba(75, 0, 130, 0.5);
    }
  }
  
  /* 旋转动画 */
  &.rotating {
    animation: rotate3d 2s ease-in-out infinite;
  }
}

@keyframes rotate3d {
  0% { transform: rotateY(0) rotateX(0); }
  25% { transform: rotateY(90deg) rotateX(10deg); }
  50% { transform: rotateY(180deg) rotateX(0); }
  75% { transform: rotateY(270deg) rotateX(-10deg); }
  100% { transform: rotateY(360deg) rotateX(0); }
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.card-back {
  background: linear-gradient(135deg, #8a2be2, #4b0082);
  border: 2px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &::before {
    content: "";
    width: 60px;
    height: 100px;
    border: 2px solid rgba(255, 255, 255, 0.7);
    border-radius: 5px;
  }
}

.card-front {
  background: linear-gradient(135deg, #f8f8ff, #e6e6fa);
  border: 2px solid #4b0082;
  transform: rotateY(180deg);
  color: #000;
  padding: 5px;
}

.card-symbol {
  font-size: 2rem;
  margin-bottom: 5px;
  color: #4b0082;
}

.card-name {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #4b0082;
  text-align: center;
}

.card-number {
  font-size: 1rem;
  font-weight: bold;
  color: #4b0082;
}

.tarot-card:not(.revealed) .card-front {
  transform: rotateY(0deg);
}

.tarot-card.revealed .card-front {
  transform: rotateY(0deg);
}

.tarot-card.revealed .card-back {
  transform: rotateY(180deg);
}

.progress-text {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: #00f0ff;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.click-hint {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: #00f0ff;
  font-size: 1rem;
  text-align: center;
  width: 120px;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* 卡牌闪光动画 */
@keyframes cardShine {
  0% { box-shadow: 0 0 15px rgba(188, 19, 254, 0.7); }
  50% { box-shadow: 0 0 25px rgba(188, 19, 254, 0.9), 0 0 40px rgba(188, 19, 254, 0.6); }
  100% { box-shadow: 0 0 15px rgba(188, 19, 254, 0.7); }
}

/* 内部闪光动画 */
@keyframes innerShine {
  0% { border-color: rgba(255, 255, 255, 0.9); }
  50% { border-color: rgba(255, 255, 255, 1); box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
  100% { border-color: rgba(255, 255, 255, 0.9); }
}

/* 闪光移动动画 */
@keyframes shineMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 卡牌发光动画 */
@keyframes cardGlow {
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
}
</style>
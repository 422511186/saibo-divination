<template>
  <div class="tarot-animation-container">
    <div class="cards-container" ref="cardsContainer">
      <!-- 牌堆 -->
      <div 
        v-if="!isDealing" 
        class="card-pile" 
        @click="startDeal"
      >
        <div class="deck-container">
          <div 
            class="card-back deck-card" 
            v-for="n in 5" 
            :key="n" 
            :style="{ 
              zIndex: 5-n, 
              transform: `translate(${(n-1)*2}px, ${(n-1)*2}px) rotate(${(n-1)*3}deg)` 
            }"
          ></div>
        </div>
        <div class="click-hint">点击开始抽牌</div>
      </div>
      
      <!-- 抽牌动画 -->
      <div v-else class="dealing-animation">
        <!-- 洗牌动画 -->
        <div v-if="currentDealStep === 0" class="shuffling-area">
          <div class="shuffling-deck">
            <div 
              class="card-back shuffling-card" 
              v-for="n in 5" 
              :key="n"
              :style="{ 
                animationDelay: `${n*0.1}s`,
                transform: `translate(${(n-3)*5}px, ${(n-3)*5}px) rotate(${(n-3)*10}deg)`
              }"
            ></div>
          </div>
          <div class="shuffle-text">洗牌中...</div>
        </div>
        
        <!-- 抽牌和翻牌动画 -->
        <div v-else class="drawing-area">
          <!-- 剩余牌堆 -->
          <div class="remaining-deck" v-if="remainingCards > 0">
            <div 
              class="card-back remaining-card" 
              v-for="n in Math.min(remainingCards, 3)" 
              :key="n"
              :style="{ 
                zIndex: 3-n,
                transform: `translate(${(n-1)*1.5}px, ${(n-1)*1.5}px)`
              }"
            ></div>
          </div>
          
          <!-- 已抽牌 -->
          <div 
            v-for="(card, index) in dealtCards" 
            :key="index"
            class="tarot-card"
            :class="{
              'drawn': card.isDealt,
              'revealed': card.isRevealed
            }"
            :style="getCardStyle(index)"
            ref="cardElements"
          >
            <div class="card-inner" :class="{ 'is-flipped': card.isRevealed }">
              <div class="card-face card-back-face">
                <div class="card-back-design"></div>
              </div>
              <div class="card-face card-front-face" :class="getSuitClass(card.suit, card.number)">
                <div class="card-header">
                  <div class="card-number-top">{{ getCardDisplayNumber(card) }}</div>
                  <div class="card-symbol-header">{{ getCardSymbol(card.suit, card.number) }}</div>
                </div>
                <div class="card-center">
                  <div class="card-symbol-center">{{ getCardSymbol(card.suit, card.number) }}</div>
                </div>
                <div class="card-footer">
                  <div class="card-symbol-footer">{{ getCardSymbol(card.suit, card.number) }}</div>
                  <div class="card-number-bottom">{{ getCardDisplayNumber(card) }}</div>
                </div>
                <div class="card-name-display">{{ getCardName(card) }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 进度文本 -->
        <div class="progress-overlay" v-if="isDealing">
          <div class="progress-text">{{ dealProgressText }}</div>
          <div class="progress-bar" v-if="currentDealStep > 0">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
// 导入塔罗牌数据
import { allTarotCards } from '@/utils/divinationAlgorithms/tarot'

interface Card {
  number: number
  suit: number  // -1: 大阿卡纳, 0: clubs, 1: diamonds, 2: hearts, 3: spades
  isDealt: boolean
  isRevealed: boolean
  name: string
  meaning: string
  reversed?: boolean
}

// 新增属性
const props = defineProps<{
  cardCount?: number
  animationSpeed?: 'slow' | 'normal' | 'fast'
}>()

const emit = defineEmits<{
  (e: 'complete', cards: {number: number, suit: number, name: string, meaning: string, reversed?: boolean}[]): void
}>()

// 响应式数据
const cardCount = props.cardCount || 3
const isDealing = ref(false)
const dealtCards = ref<Card[]>([])
const currentDealStep = ref(0)
const totalCards = ref(78)
const cardsContainer = ref<HTMLElement | null>(null)
const cardElements = ref<HTMLElement[]>([])
const allCards = ref<Card[]>([])

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

const progressPercent = computed(() => {
  if (currentDealStep.value === 0) return 0
  if (currentDealStep.value <= cardCount.value) {
    return (currentDealStep.value / cardCount.value) * 50
  }
  if (currentDealStep.value === cardCount.value + 1) {
    return 75
  }
  return 100
})

// 动画速度映射
const animationSpeedMap = {
  slow: 2.5,
  normal: 1.8,
  fast: 1.2
}

const currentSpeed = computed(() => {
  return animationSpeedMap[props.animationSpeed || 'normal']
})

// 获取卡牌编号（用于显示）
const getCardDisplayNumber = (card: any) => {
  // 确保返回正确的卡牌信息
  if (card && card.name) {
    return card.name;
  }
  return card?.number || "未知";
}

// 获取卡牌名称（使用从数据中获取的名称）
const getCardName = (card: any) => {
  if (card && card.name) {
    return card.name;
  }
  return "未知卡牌";
}

// 获取花色符号
const getCardSymbol = (suit: number, number: number) => {
  // 大阿卡那牌
  if (suit === -1) return "★"
  
  // 小阿卡那牌花色映射（根据编号范围确定花色）
  // 权杖 (22-35) -> 梅花 (♣)
  if (number >= 22 && number <= 35) return '♣'
  // 圣杯 (36-49) -> 红心 (♥)
  if (number >= 36 && number <= 49) return '♥'
  // 宝剑 (50-63) -> 黑桃 (♠)
  if (number >= 50 && number <= 63) return '♠'
  // 星币 (64-77) -> 方块 (♦)
  if (number >= 64 && number <= 77) return '♦'
  
  // 如果编号不在预期范围内，使用传统的suit值
  const symbols = ['♣', '♦', '♥', '♠']
  return symbols[suit] || '♣'
}

// 获取花色对应的CSS类
const getSuitClass = (suit: number, number: number) => {
  // 大阿卡那牌
  if (suit === -1) return 'major-arcana'
  
  // 小阿卡那牌花色映射（根据编号范围确定花色）
  // 权杖 (22-35) -> 梅花 (clubs)
  if (number >= 22 && number <= 35) return 'clubs'
  // 圣杯 (36-49) -> 红心 (hearts)
  if (number >= 36 && number <= 49) return 'hearts'
  // 宝剑 (50-63) -> 黑桃 (spades)
  if (number >= 50 && number <= 63) return 'spades'
  // 星币 (64-77) -> 方块 (diamonds)
  if (number >= 64 && number <= 77) return 'diamonds'
  
  // 如果编号不在预期范围内，使用传统的suit值
  const suitClasses = ['clubs', 'diamonds', 'hearts', 'spades']
  return suitClasses[suit] || 'clubs'
}

// 获取卡牌样式
const getCardStyle = (index: number) => {
  const positions = [
    { x: -150, y: -50, rotate: -15 },
    { x: 0, y: -80, rotate: 0 },
    { x: 150, y: -50, rotate: 15 },
    { x: -75, y: 50, rotate: -10 },
    { x: 75, y: 50, rotate: 10 }
  ]
  
  const pos = positions[index] || { x: 0, y: 0, rotate: 0 }
  
  if (dealtCards.value[index]?.isDealt) {
    return {
      '--x': `${pos.x}px`,
      '--y': `${pos.y}px`,
      '--rotate': `${pos.rotate}deg`
    }
  }
  
  return {}
}

// 洗牌函数
const shuffleCards = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled
}

// 洗牌动画
const shuffleAnimation = async () => {
  // 增加洗牌时间，让用户看到明显的洗牌过程
  await new Promise(resolve => setTimeout(resolve, 3000 * currentSpeed.value))
}

// 抽牌动画
const drawCardAnimation = async (index: number) => {
  await nextTick()
  
  const cardElement = cardElements.value[index]
  if (!cardElement) return
  
  // 使用GSAP创建更流畅的抽牌动画
  return new Promise(resolve => {
    gsap.fromTo(cardElement,
      {
        x: 0,
        y: 150,
        rotation: 0,
        scale: 0.8,
        opacity: 0
      },
      {
        x: parseFloat(getComputedStyle(cardElement).getPropertyValue('--x') || '0'),
        y: parseFloat(getComputedStyle(cardElement).getPropertyValue('--y') || '0'),
        rotation: parseFloat(getComputedStyle(cardElement).getPropertyValue('--rotate') || '0'),
        scale: 1,
        opacity: 1,
        duration: 1.5 * currentSpeed.value, // 增加抽牌动画时间
        ease: "back.out(1.7)",
        onComplete: resolve
      }
    )
  })
}

// 翻牌动画
const flipCardAnimation = async (index: number) => {
  await nextTick()
  
  const cardElement = cardElements.value[index]
  if (!cardElement) return
  
  const cardInner = cardElement.querySelector('.card-inner') as HTMLElement
  if (!cardInner) return
  
  return new Promise(resolve => {
    gsap.to(cardInner, {
      rotationY: 180,
      duration: 1.2 * currentSpeed.value, // 增加翻牌动画时间
      ease: "power2.out",
      onComplete: resolve
    })
  })
}

// 开始抽牌
const startDeal = async () => {
  isDealing.value = true
  currentDealStep.value = 0
  dealtCards.value = []
  
  // 使用组件内的洗牌函数
  const shuffledCards = shuffleCards(allTarotCards.map(card => ({
    ...card,
    isDealt: false,
    isRevealed: false
  })))
  
  allCards.value = shuffledCards
  
  // 初始化要抽取的牌
  dealtCards.value = Array(cardCount.value).fill(null).map((_, i) => ({
    ...shuffledCards[i],
    isDealt: false,
    isRevealed: false
  }))
  
  // 洗牌动画
  await shuffleAnimation()
  
  // 逐张抽牌
  for (let i = 0; i < cardCount.value; i++) {
    // 从洗好的牌中取出一张
    const card = allCards.value[i]
    
    dealtCards.value[i] = {
      ...card,
      isDealt: true,
      isRevealed: false // 初始时背面朝上
    }
    
    currentDealStep.value = i + 1
    await drawCardAnimation(i)
    await new Promise(resolve => setTimeout(resolve, 500 * currentSpeed.value)) // 增加每张牌之间的间隔
  }
  
  // 翻牌前的停顿
  currentDealStep.value = cardCount.value + 1
  await new Promise(resolve => setTimeout(resolve, 1000 * currentSpeed.value))
  
  // 逐张翻牌
  for (let i = 0; i < cardCount.value; i++) {
    // 为每张牌决定是否为逆位
    const reversed = Math.random() < 0.3
    dealtCards.value[i].reversed = reversed
    dealtCards.value[i].isRevealed = true // 翻转显示正面
    await flipCardAnimation(i)
    await new Promise(resolve => setTimeout(resolve, 800 * currentSpeed.value)) // 增加翻牌间隔
  }
  
  currentDealStep.value = cardCount.value + 2
  
  // 完成前的停顿，让用户看清楚结果
  await new Promise(resolve => setTimeout(resolve, 2000 * currentSpeed.value))
  
  const cardResults = dealtCards.value.map(card => ({
    number: card.number,
    suit: card.suit,
    name: card.name,
    meaning: card.reversed ? card.reversed : card.meaning,
    reversed: card.reversed
  }))
  
  emit('complete', cardResults)
}

// 组件卸载时清理
onUnmounted(() => {
  // 清理可能存在的动画
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
  overflow: hidden;
  background: radial-gradient(circle at center, #0a0a1a 0%, #000000 100%);
}

.cards-container {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-pile {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.deck-container {
  position: relative;
  width: 100px;
  height: 140px;
}

.deck-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border: 2px solid #4cc9f0;
  
  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 2px solid rgba(76, 201, 240, 0.5);
    border-radius: 6px;
  }
}

.click-hint {
  color: #4cc9f0;
  font-size: 1.1rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(76, 201, 240, 0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-5px); }
  100% { opacity: 0.6; transform: translateY(0); }
}

.shuffling-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.shuffling-deck {
  position: relative;
  width: 120px;
  height: 160px;
}

.shuffling-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border: 2px solid #f72585;
  animation: shuffleCard 1s ease-in-out infinite alternate;
}

@keyframes shuffleCard {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(10px, -10px) rotate(10deg); }
}

.shuffle-text {
  color: #f72585;
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(247, 37, 133, 0.7);
}

.drawing-area {
  position: relative;
  width: 100%;
  height: 100%;
}

.remaining-deck {
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  height: 120px;
}

.remaining-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  border: 1px solid #4361ee;
}

.tarot-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90px;
  height: 130px;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
  transition: none;
}

.tarot-card.drawn {
  transform: translate(var(--x, 0), var(--y, 0)) rotate(var(--rotate, 0));
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: rotateY(0deg);
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.card-back-face {
  background: linear-gradient(135deg, #3a0ca3, #4361ee);
  border: 2px solid #7209b7;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-back-design {
  width: 60%;
  height: 60%;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  position: relative;
  
  &::before {
    content: "✦";
    position: absolute;
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.card-front-face {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border: 2px solid #4361ee;
  transform: rotateY(180deg);
  color: #212529;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 5px;
  position: relative;
}

.card-front-face.hearts {
  background: linear-gradient(135deg, #fff5f5, #ffe0e0);
  border: 2px solid #ff6b6b;
  color: #d63384;
}

.card-front-face.diamonds {
  background: linear-gradient(135deg, #fff0f7, #ffe0f0);
  border: 2px solid #e83e8c;
  color: #d63384;
}

.card-front-face.clubs {
  background: linear-gradient(135deg, #f0fff4, #e0ffe8);
  border: 2px solid #20c997;
  color: #198754;
}

.card-front-face.spades {
  background: linear-gradient(135deg, #f0f2f5, #e0e5ec);
  border: 2px solid #6c757d;
  color: #212529;
}

.card-front-face.major-arcana {
  background: linear-gradient(135deg, #f8f0ff, #f0e0ff);
  border: 2px solid #6f42c1;
  color: #6f42c1;
}

.card-header, .card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.card-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.card-symbol-center {
  font-size: 2.5rem;
  opacity: 0.8;
}

.card-name-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.9rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.card-number-top, .card-number-bottom {
  font-size: 0.9rem;
  font-weight: bold;
}

.card-symbol-header, .card-symbol-footer {
  font-size: 1rem;
}

.card-number-bottom {
  transform: rotate(180deg);
}

.card-symbol-footer {
  transform: rotate(180deg);
}

.progress-overlay {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.progress-text {
  color: #4cc9f0;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(76, 201, 240, 0.5);
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: rgba(10, 10, 26, 0.7);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #4361ee;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f72585, #4361ee, #4cc9f0);
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>
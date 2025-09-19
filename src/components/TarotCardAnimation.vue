<template>
  <div class="tarot-animation-container">
    <div class="cards-container" ref="cardsContainer">
      <!-- 牌堆 -->
      <div 
        v-if="!isDealing" 
        class="card-pile" 
        @click="startDeal"
      >
        <div class="card-back" v-for="n in 5" :key="n" :style="{ zIndex: n, transform: `translate(${(n-3)*2}px, ${(n-3)*2}px)` }"></div>
        <div class="click-hint">点击开始抽牌</div>
      </div>
      
      <!-- 抽牌动画 -->
      <div v-else class="dealing-animation">
        <!-- 牌堆（剩余的牌） -->
        <div class="remaining-cards" v-if="remainingCards > 0">
          <div class="card-back" v-for="n in Math.min(remainingCards, 3)" :key="n" :style="{ zIndex: n }"></div>
        </div>
        
        <div 
          v-for="(card, index) in dealtCards" 
          :key="index"
          class="tarot-card"
          :class="{ dealt: card.isDealt, revealed: card.isRevealed, 'in-deck': !card.isDealt }"
          :style="getCardStyle(index)"
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
import { ref, computed } from 'vue'
import { gsap } from 'gsap'

interface Card {
  number: number
  suit: number  // -1: 大阿卡纳, 0: clubs, 1: diamonds, 2: hearts, 3: spades
  isDealt: boolean
  isRevealed: boolean
}

const props = defineProps<{
  cardCount?: number
}>()

const emit = defineEmits<{
  (e: 'complete', cards: {number: number, suit: number}[]): void
}>()

const cardCount = props.cardCount || 3
const isDealing = ref(false)
const dealtCards = ref<Card[]>([])
const currentDealStep = ref(0)
const totalCards = ref(78)  // 塔罗牌总数
const cardsContainer = ref<HTMLElement | null>(null)
const allCards = ref<Card[]>([]) // 存储所有洗好的牌

const remainingCards = computed(() => {
  return Math.max(0, totalCards.value - currentDealStep.value)
})

const dealProgressText = computed(() => {
  if (currentDealStep.value === 0) return "洗牌中..."
  if (currentDealStep.value <= cardCount.value) return `抽取第${currentDealStep.value}张牌...`
  if (currentDealStep.value === cardCount.value + 1) return "翻牌中..."
  return "完成!"
})

const getCardSymbol = (suit: number) => {
  // 大阿卡纳牌没有花色
  if (suit === -1) return "★"
  const symbols = ['♣', '♦', '♥', '♠']
  return symbols[suit]
}

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

const startDeal = () => {
  isDealing.value = true
  currentDealStep.value = 0
  dealtCards.value = []
  
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
  dealCards()
}

const dealCards = () => {
  // 使用循环替代递归调用，避免卡死
  const processNextCard = async () => {
    // 洗牌动画
    await new Promise(resolve => setTimeout(resolve, 2000))
    currentDealStep.value = 1
    
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
      
      // 使用GSAP动画
      if (cardsContainer.value) {
        // 等待DOM更新
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const cardElements = cardsContainer.value.querySelectorAll('.tarot-card')
        if (cardElements[i]) {
          gsap.fromTo(cardElements[i], 
            { 
              x: 0, 
              y: 0, 
              rotation: 0,
              scale: 1,
              opacity: 0
            },
            { 
              x: (i - 1) * 150 + 50, 
              y: -100, 
              rotation: (i - 1) * 15,
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            }
          )
        }
      }
      
      // 等待动画完成再继续
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    // 翻牌
    currentDealStep.value = cardCount.value + 1
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 逐张翻牌
    for (let i = 0; i < cardCount.value; i++) {
      dealtCards.value[i].isRevealed = true
      
      // 翻牌动画
      if (cardsContainer.value) {
        const cardElements = cardsContainer.value.querySelectorAll('.tarot-card')
        if (cardElements[i]) {
          gsap.to(cardElements[i], {
            rotationY: 180,
            duration: 0.6
          })
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    currentDealStep.value = cardCount.value + 2
    
    // 完成动画
    await new Promise(resolve => setTimeout(resolve, 1500))
    const cardResults = dealtCards.value.map(card => ({
      number: card.number,
      suit: card.suit
    }))
    emit('complete', cardResults)
  }
  
  processNextCard()
}
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
}

.dealing-animation {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.remaining-cards {
  position: absolute;
  left: -200px;
  top: 50%;
  transform: translateY(-50%);
}

.remaining-cards .card-back {
  width: 60px;
  height: 90px;
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
</style>
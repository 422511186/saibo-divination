<template>
  <div class="result-view">
    <Cyber3DAnimation />
    <div class="result-container">
      <div v-if="typeId === 'iChing'" class="iChing-result">
        <h2>易经占卜结果</h2>
        <div class="hexagram-display">
          <div class="hexagram-name">{{ (currentResult?.details as any)?.hexagramName }}</div>
          <div class="hexagram-image">{{ (currentResult?.details as any)?.hexagramImage }}</div>
        </div>
        <div class="yao-details">
          <div v-for="(yao, index) in (currentResult?.details as any)?.yaos" :key="index" class="yao-item">
            <div class="yao-position">{{ getYaoPosition(index) }}</div>
            <div class="yao-type">{{ getYaoTypeText(yao) }}</div>
          </div>
        </div>
        <div class="hexagram-detail-section">
          <h3>卦辞</h3>
          <p>{{ (currentResult?.details as any)?.judgment }}</p>
          <h3>爻辞</h3>
          <p>{{ (currentResult?.details as any)?.lines }}</p>
          <h3>象传</h3>
          <p>{{ (currentResult?.details as any)?.image }}</p>
        </div>
      </div>
      <div v-else-if="typeId === 'tarot'" class="tarot-result">
        <h2>塔罗牌占卜结果</h2>
        <div class="tarot-cards">
          <div v-for="(card, index) in (currentResult?.details as any)?.cards" :key="index" class="tarot-card-result">
            <div class="card-symbol">{{ getCardSymbol(card.suit) }}</div>
            <div class="card-name">{{ getTarotCardName(card) }}</div>
            <div class="card-meaning">{{ card.meaning }}</div>
          </div>
        </div>
        <div class="interpretation">
          <h3>解读</h3>
          <p>{{ (currentResult?.details as any)?.interpretation }}</p>
        </div>
      </div>
      <div v-else-if="typeId === 'qianShi'" class="qianShi-result">
        <h2>签诗占卜结果</h2>
        <div class="poem-result">
          <div class="poem-rank" :class="getRankClass((currentResult?.details as any)?.poemData?.rank)">
            {{ getRankText((currentResult?.details as any)?.poemData?.rank) }}
          </div>
          <div class="poem-content">
            <h3>签诗</h3>
            <p>{{ (currentResult?.details as any)?.poemData?.poem }}</p>
          </div>
          <div class="poem-meaning">
            <h3>解签</h3>
            <p>{{ (currentResult?.details as any)?.poemData?.meaning }}</p>
          </div>
        </div>
      </div>
      <div v-else-if="typeId === 'plumFlower'" class="plumFlower-result">
        <h2>梅花易数结果</h2>
        <div class="plum-flower-result">
          <div class="hexagram-display">
            <div class="hexagram-name">{{ (currentResult?.details as any)?.hexagramName }}</div>
            <div class="hexagram-image">{{ (currentResult?.details as any)?.hexagramImage }}</div>
          </div>
          <div class="interpretation">
            <h3>解读</h3>
            <p>{{ (currentResult?.details as any)?.interpretation }}</p>
          </div>
        </div>
      </div>
      <div v-else class="no-result">
        <h2>无结果</h2>
        <p>未找到占卜结果</p>
      </div>
    </div>
    <div class="result-actions">
      <button @click="saveToHistory" class="action-btn">保存到历史</button>
      <button @click="shareResult" class="action-btn">分享结果</button>
      <button @click="divineAgain" class="action-btn">再次占卜</button>
      <button @click="goHome" class="action-btn">返回首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDivinationStore } from '../store/divination'
import { useHistoryStore } from '../store/history'
import Cyber3DAnimation from '../components/Cyber3DAnimation.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const divinationStore = useDivinationStore()
const historyStore = useHistoryStore()

// 从路由参数和store中获取typeId
const typeId = computed(() => {
  // 优先使用路由参数
  const routeType = route.params.type as string
  if (routeType) {
    return routeType
  }
  
  // 如果路由参数不存在，尝试从结果中获取
  const resultType = divinationStore.currentResult?.type
  if (resultType) {
    return resultType
  }
  
  // 如果都不存在，返回默认值
  return ''
})

const currentResult = computed(() => {
  return divinationStore.currentResult
})

const getYaoPosition = (index: number) => {
  const positions = ['初九', '九二', '九三', '九四', '九五', '上九']
  // 确保index在有效范围内，防止显示第七爻
  if (index >= 0 && index < positions.length) {
    return positions[index]
  }
  // 如果index超出范围，返回空字符串而不是显示第七爻
  return ''
}

const getYaoTypeText = (yao: number) => {
  return yao === 0 ? '阴爻' : '阳爻'
}

const getCardSymbol = (suit: string) => {
  const symbols: Record<string, string> = {
    major: '⭐',
    cups: '🍷',
    swords: '⚔️',
    wands: '🪄',
    pentacles: '🪙'
  }
  return symbols[suit] || '📜'
}

const getTarotCardName = (card: any) => {
  // 检查suit是否存在且不为undefined
  if (card.suit && card.suit !== undefined) {
    return `${card.name} (${card.suit})`
  } else {
    return card.name
  }
}

// 签诗相关方法
const getRankClass = (rank: string) => {
  const rankClasses: Record<string, string> = {
    '上上签': 'rank-very-good',
    '上中签': 'rank-good',
    '中签': 'rank-neutral',
    '下中签': 'rank-bad',
    '下下签': 'rank-very-bad'
  }
  return rankClasses[rank] || 'rank-neutral'
}

const getRankText = (rank: string) => {
  // 如果rank存在，直接返回
  if (rank) return rank
  
  // 如果没有rank，尝试从poemData中推断等级
  if (currentResult.value && currentResult.value.details && (currentResult.value.details as any).poemData) {
    const poemData = (currentResult.value.details as any).poemData
    const meaning = poemData.meaning || ''
    
    // 根据含义内容推断等级
    if (meaning.includes('大吉') || meaning.includes('上上')) {
      return '上上签'
    } else if (meaning.includes('吉') || meaning.includes('顺利')) {
      return '上中签'
    } else if (meaning.includes('中吉') || meaning.includes('平稳')) {
      return '中签'
    } else if (meaning.includes('凶') || meaning.includes('困难')) {
      return '下中签'
    } else if (meaning.includes('大凶')) {
      return '下下签'
    }
  }
  
  // 如果无法推断，返回默认值
  return '未知等级'
}

const saveToHistory = () => {
  if (!currentResult.value) {
    return
  }
  historyStore.addRecord(currentResult.value)
  // 显示保存成功提示
  ElMessage.success('已保存到历史记录')
}

const shareResult = () => {
  // 实现分享功能
  ElMessage.info('分享功能开发中')
}

const divineAgain = () => {
  // 修正路由路径，添加/process后缀
  router.push(`/divination/${typeId.value}/process`)
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.result-view {
  position: relative;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.result-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--bg-secondary);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  color: var(--accent-primary);
  margin-bottom: 20px;
  text-align: center;
}

h3 {
  color: var(--accent-secondary);
  margin-top: 20px;
  margin-bottom: 10px;
}

.hexagram-display {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px;
  background-color: var(--bg-tertiary);
  border-radius: 8px;
}

.hexagram-name, .hexagram-image {
  font-size: 18px;
  font-weight: bold;
}

.yao-details {
  margin-bottom: 20px;
}

.yao-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 5px;
  background-color: var(--bg-tertiary);
  border-radius: 5px;
}

.yao-position {
  font-weight: bold;
}

.tarot-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.tarot-card-result {
  padding: 15px;
  background-color: var(--bg-tertiary);
  border-radius: 8px;
  text-align: center;
}

.card-symbol {
  font-size: 24px;
  margin-bottom: 10px;
}

.card-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.poem-result {
  margin-bottom: 20px;
}

.poem-rank {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}

.rank-very-good {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.rank-good {
  background-color: rgba(139, 195, 74, 0.2);
  color: #8BC34A;
}

.rank-neutral {
  background-color: rgba(255, 193, 7, 0.2);
  color: #FFC107;
}

.rank-bad {
  background-color: rgba(255, 152, 0, 0.2);
  color: #FF9800;
}

.rank-very-bad {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.poem-content, .poem-meaning {
  padding: 15px;
  margin-bottom: 15px;
  background-color: var(--bg-tertiary);
  border-radius: 8px;
}

.interpretation {
  padding: 15px;
  background-color: var(--bg-tertiary);
  border-radius: 8px;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.action-btn {
  padding: 10px 20px;
  background-color: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: var(--accent-secondary);
}

.no-result {
  text-align: center;
  padding: 40px;
}

@media (max-width: 768px) {
  .result-container {
    padding: 15px;
  }
  
  .tarot-cards {
    grid-template-columns: 1fr;
  }
  
  .result-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 80%;
  }
}
</style>
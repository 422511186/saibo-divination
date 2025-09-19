<template>
  <div class="result-view">
    <div class="content">
      <div class="result-container">
        <!-- 3D背景动画 -->
        <div class="result-3d-background">
          <Cyber3DAnimation />
        </div>
        
        <!-- 结果展示区域 -->
        <div class="result-display">
          <div class="result-content" v-if="currentResult">
            <div class="result-layout">
              <!-- 左侧：牌/卦象显示 -->
              <div class="result-left">
                
                <!-- 牌/卦象显示区域 -->
                <div class="cards-display-area">
                  <div v-if="currentResult.type === 'iChing'">
                    <p>卦象编号: {{ currentResult.result.hexagram }}</p>
                    <p>变爻: {{ currentResult.result.changingLines.filter(Boolean).length }} 个</p>
                    <!-- 显示六爻详情 -->
                    <div class="yao-details" v-if="currentResult.details && currentResult.details.yao">
                      <h3>六爻详情</h3>
                      <div class="yao-list">
                        <div 
                          v-for="(yao, index) in currentResult.details.yao" 
                          :key="index" 
                          class="yao-item"
                          :class="{ changing: currentResult.details.changingLines && currentResult.details.changingLines[index] }"
                        >
                          <span class="yao-position">{{ getYaoPosition(index) }}</span>
                          <span class="yao-type">{{ getYaoTypeText(yao) }}</span>
                          <span class="yao-changing" v-if="currentResult.details.changingLines && currentResult.details.changingLines[index]">变爻</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="currentResult.type === 'tarot'">
                    <p>抽到的牌:</p>
                    <div class="tarot-cards-container">
                      <div 
                        v-for="(card, index) in currentResult.result.cards" 
                        :key="index"
                        class="tarot-card-result"
                      >
                        <div class="card-content">
                          <div class="card-symbol">{{ getCardSymbol(card.suit) }}</div>
                          <div class="card-name">{{ getTarotCardName(card) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="currentResult.type === 'qianShi'">
                    <p>签号: {{ currentResult.result.signNumber }}</p>
                  </div>
                  <div v-else-if="currentResult.type === 'plumFlower'">
                    <p>上卦: {{ currentResult.result.upperYao.join('') }}</p>
                    <p>下卦: {{ currentResult.result.lowerYao.join('') }}</p>
                    <p>卦象编号: {{ currentResult.result.hexagram }}</p>
                  </div>
                </div>
              </div>
              
              <!-- 右侧：解释内容 -->
              <div class="result-right">
                <h2>算卦结果</h2>
                
                <!-- 详细的解释内容 -->
                <div v-if="currentResult.type === 'iChing' && currentResult.details && currentResult.details.hexagramData" class="hexagram-detail-section">
                  <h3>卦象解释</h3>
                  <div class="hexagram-info">
                    <p><strong>卦名:</strong> {{ currentResult.details.hexagramData.chineseName }} ({{ currentResult.details.hexagramData.name }})</p>
                    <p><strong>卦辞:</strong> {{ currentResult.details.hexagramData.judgment }}</p>
                    <p><strong>象辞:</strong> {{ currentResult.details.hexagramData.image }}</p>
                    <div v-if="currentResult.details.changingLines && currentResult.details.changingLines.filter(Boolean).length > 0">
                      <h4>变爻解释</h4>
                      <div v-for="(isChanging, index) in currentResult.details.changingLines" :key="index" v-if="isChanging">
                        <p><strong>{{ getYaoPosition(index) }}:</strong> {{ currentResult.details.hexagramData.lines[index] }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else-if="currentResult.type === 'tarot' && currentResult.details && currentResult.details.cardDetails" class="tarot-detail-section">
                  <h3>牌义解释</h3>
                  <div v-for="(cardDetail, index) in currentResult.details.cardDetails" :key="index" class="card-detail">
                    <h4>{{ cardDetail.name }}<span v-if="cardDetail.reversed"> (逆位)</span></h4>
                    <p><strong>含义:</strong> {{ cardDetail.reversed ? cardDetail.reversed : cardDetail.meaning }}</p>
                  </div>
                </div>
                
                <div v-else-if="currentResult.type === 'qianShi' && currentResult.details && currentResult.details.poemData" class="qianshi-detail-section">
                  <h3>签诗内容</h3>
                  <div class="poem-content">
                    <p><strong>签题:</strong> {{ currentResult.details.poemData.title }}</p>
                    <p><strong>签诗:</strong> {{ currentResult.details.poemData.content }}</p>
                    <p><strong>解释:</strong> {{ currentResult.details.poemData.explanation }}</p>
                    <p><strong>寓意:</strong> {{ currentResult.details.poemData.meaning }}</p>
                  </div>
                </div>
                
                <div v-else-if="currentResult.type === 'plumFlower' && currentResult.details && currentResult.details.hexagramData" class="plumflower-detail-section">
                  <h3>卦象解释</h3>
                  <div class="hexagram-info">
                    <p><strong>卦名:</strong> {{ currentResult.details.hexagramData.chineseName }} ({{ currentResult.details.hexagramData.name }})</p>
                    <p><strong>描述:</strong> {{ currentResult.details.hexagramData.description }}</p>
                    <p><strong>卦辞:</strong> {{ currentResult.details.hexagramData.judgment }}</p>
                    <p><strong>象辞:</strong> {{ currentResult.details.hexagramData.image }}</p>
                  </div>
                </div>
                
                <div class="interpretation">
                  <h3>结果解读</h3>
                  <p>{{ currentResult.interpretation }}</p>
                </div>
              </div>
            </div>
            
            <div class="user-question" v-if="currentResult.question">
              <h3>您的问题</h3>
              <p>{{ currentResult.question }}</p>
            </div>
          </div>
          
          <div class="no-result" v-else>
            <p>暂无算卦结果</p>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="result-actions">
          <button class="cyber-button" @click="saveToHistory">
            保存到历史记录
          </button>
          <button class="cyber-button secondary" @click="shareResult">
            分享结果
          </button>
          <button 
            v-if="typeId" 
            class="cyber-button secondary" 
            @click="divineAgain"
          >
            再算一次
          </button>
          <button class="cyber-button secondary" @click="goHome">
            返回主页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDivinationStore } from '../store/divination'
import { useHistoryStore } from '../store/history'
import Cyber3DAnimation from '../components/Cyber3DAnimation.vue'
import HexagramDetail from '../components/HexagramDetail.vue'

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

const currentDivination = computed(() => {
  if (!typeId.value) {
    return null
  }
  return divinationStore.getDivinationTypeById(typeId.value)
})

const currentResult = computed(() => {
  return divinationStore.currentResult
})

const getResultIcon = () => {
  const icons: Record<string, string> = {
    iChing: '🔮',
    tarot: '🃏',
    qianShi: '🎋',
    plumFlower: '🌸'
  }
  return icons[typeId.value] || '🔮'
}

const getYaoPosition = (index: number) => {
  const positions = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
  return positions[index]
}

const getYaoTypeText = (yao: number) => {
  // 2表示阳爻，3表示阴爻
  return yao === 2 ? '阳爻 (━━━━━)' : '阴爻 (━ ━ ━)'
}

const getCardSymbol = (suit: number) => {
  // 大阿卡纳牌没有花色
  if (suit === -1) return '★'
  const symbols = ['♣', '♦', '♥', '♠']
  return symbols[suit] || ''
}

const getTarotCardName = (card: any) => {
  // 如果卡片有name属性，直接使用
  if (card.name) {
    return card.name + (card.reversed ? ' (逆位)' : '')
  }
  
  // 大阿卡纳牌 (suit = -1)
  if (card.suit === -1) {
    const majorArcana = [
      '愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人',
      '战车', '力量', '隐者', '命运之轮', '正义', '倒吊人', '死神',
      '节制', '恶魔', '塔', '星星', '月亮', '太阳', '审判', '世界'
    ]
    return (majorArcana[card.number] || `大阿卡纳${card.number}`) + (card.reversed ? ' (逆位)' : '')
  }
  
  // 小阿卡纳牌
  const suits = ['♣', '♦', '♥', '♠']
  const suitSymbol = suits[card.suit] || ''
  
  let cardName = ''
  if (card.number === 1) {
    cardName = 'A'
  } else if (card.number > 1 && card.number <= 10) {
    cardName = card.number.toString()
  } else {
    // 将英文J、Q、K改为中文表示
    const names = ['侍从', '王后', '国王']
    cardName = names[card.number - 11] || card.number.toString()
  }
  
  return `${suitSymbol}${cardName}` + (card.reversed ? ' (逆位)' : '')
}

const saveToHistory = () => {
  if (currentResult.value) {
    historyStore.addRecord(currentResult.value)
    alert('结果已保存到历史记录')
  }
}

const shareResult = () => {
  if (currentResult.value) {
    const text = `我在赛博算卦网站进行了${currentDivination.value?.name}，结果是：${currentResult.value.interpretation}`
    if (navigator.share) {
      navigator.share({
        title: '赛博算卦结果',
        text: text
      })
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(text)
      alert('结果已复制到剪贴板')
    }
  }
}

const divineAgain = () => {
  // 检查typeId是否存在
  if (typeId.value) {
    router.push(`/divination/${typeId.value}/process`)
  } else {
    // 如果typeId不存在，重定向到选择页面
    router.push('/divination')
  }
}

const goHome = () => {
  router.push('/divination')
}
</script>

<style scoped lang="scss">
.result-3d-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.3;
  pointer-events: none; /* 确保背景不会拦截点击事件 */
}

.result-view {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c14 0%, #141428 100%);
  position: relative;
}

.result-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.result-display {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 20px rgba(188, 19, 254, 0.3);
  backdrop-filter: blur(10px);
}

.result-layout {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.result-left {
  flex: 1;
  background: rgba(8, 8, 16, 0.5);
  border: 1px solid #00f0ff;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.result-icon {
  display: none;
}

.cards-display-area {
  width: 100%;
  text-align: center;
  color: #00f0ff;
  font-size: 1.1rem;
}

.tarot-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.tarot-card-result {
  width: 100px;
  height: 140px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 2px solid #4b0082;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 15px rgba(75, 0, 130, 0.2), 0 2px 5px rgba(0, 0, 0, 0.3);
  color: #000;
  padding: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tarot-card-result:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(75, 0, 130, 0.3), 0 4px 8px rgba(0, 0, 0, 0.4);
}

.card-content {
  text-align: center;
}

.card-symbol {
  font-size: 3rem;
  margin-bottom: 10px;
  color: #4b0082;
}

.card-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: #4b0082;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
}

.result-right {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.result-right h2 {
  color: #ff00ff;
  margin-bottom: 1rem;
}

.interpretation {
  margin-top: 1.5rem;
}

.interpretation h3, .user-question h3 {
  color: #ff00ff;
  margin-bottom: 1rem;
}

.interpretation p, .user-question p {
  color: #00f0ff;
  line-height: 1.6;
  font-size: 1.1rem;
}

.yao-details h3 {
  color: #ff00ff;
  margin: 1rem 0 0.5rem 0;
}

.yao-list {
  margin-top: 0.5rem;
  text-align: left;
}

.yao-item {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
}

.yao-item.changing {
  background: rgba(255, 255, 0, 0.1);
  border-radius: 4px;
  padding: 0.3rem;
}

.yao-position {
  color: #00f0ff;
  font-weight: bold;
}

.yao-type {
  color: #bc13fe;
}

.yao-changing {
  color: #ffff00;
  font-weight: bold;
}

.hexagram-detail-section, .tarot-detail-section, .qianshi-detail-section, .plumflower-detail-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(8, 8, 16, 0.3);
  border-radius: 8px;
}

.hexagram-detail-section h3, .tarot-detail-section h3, .qianshi-detail-section h3, .plumflower-detail-section h3 {
  color: #ff00ff;
  margin-bottom: 0.8rem;
}

.hexagram-info, .poem-content {
  color: #00f0ff;
  line-height: 1.6;
}

.hexagram-info p, .poem-content p {
  margin-bottom: 0.5rem;
}

.card-detail {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
}

.card-detail:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.card-detail h4 {
  color: #ff00ff;
  margin-bottom: 0.3rem;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.cyber-button {
  padding: 12px 25px;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  color: #0c0c14;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 0 15px rgba(188, 19, 254, 0.5);
}

.cyber-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(188, 19, 254, 0.8);
}

.cyber-button.secondary {
  background: transparent;
  border: 1px solid #00f0ff;
  color: #00f0ff;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}

.cyber-button.secondary:hover {
  background: rgba(0, 240, 255, 0.1);
  box-shadow: 0 5px 20px rgba(0, 240, 255, 0.5);
}
</style>
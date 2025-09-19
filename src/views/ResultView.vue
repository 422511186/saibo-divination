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
                  <div v-else-if="currentResult.type === 'qianShi'" class="qianshi-card">
                    <div class="qianshi-header">
                      <div class="qian-symbol">筶</div>
                      <div class="qian-number">第{{ currentResult.result.signNumber }}签</div>
                    </div>
                    <div v-if="currentResult.details && currentResult.details.poemData">
                      <div class="qian-rank" :class="getRankClass(currentResult.details.poemData.rank)">
                        {{ getRankText(currentResult.details.poemData.rank) }}
                      </div>
                      <div class="qian-preview">
                        "{{ getPreviewText(currentResult.details.poemData.content) }}"
                      </div>
                    </div>
                  </div>
                  <div v-else-if="currentResult.type === 'plumFlower'">
                    <div class="plumflower-card">
                      <div class="plumflower-header">
                        <div class="plumflower-symbol">🌸</div>
                      </div>
                      <div class="plumflower-details">
                        <div class="hexagram-yao">
                          <span class="yao-label">上卦:</span>
                          <div class="yao-display">
                            <span v-for="(yao, index) in currentResult.result.upperYao" :key="'upper-' + index" class="yao-symbol" :class="{ yang: yao === 1, yin: yao === 0 }">{{ yao === 1 ? '━' : '━ ━' }}</span>
                          </div>
                        </div>
                        <div class="hexagram-yao">
                          <span class="yao-label">下卦:</span>
                          <div class="yao-display">
                            <span v-for="(yao, index) in currentResult.result.lowerYao" :key="'lower-' + index" class="yao-symbol" :class="{ yang: yao === 1, yin: yao === 0 }">{{ yao === 1 ? '━' : '━ ━' }}</span>
                          </div>
                        </div>
                        <div class="hexagram-number">
                          卦象编号: {{ currentResult.result.hexagram }}
                        </div>
                      </div>
                    </div>
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
    qianShi: '🎴',
    plumFlower: '🌸'
  }
  return icons[typeId.value] || '✨'
}

const getYaoPosition = (index: number) => {
  const positions = ['初九', '九二', '九三', '九四', '九五', '上九']
  return positions[index] || `第${index + 1}爻`
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
  if (currentResult.value && currentResult.value.details && currentResult.value.details.poemData) {
    const poemData = currentResult.value.details.poemData
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

const getPreviewText = (content: string) => {
  if (!content) return ''
  // 取前30个字符作为预览
  return content.length > 30 ? content.substring(0, 30) + '...' : content
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
}

.result-right {
  flex: 1;
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

/* 签诗卡片样式 */
.qianshi-card {
  background: linear-gradient(135deg, #1a1a3a, #2a2a4a);
  border: 2px solid #ffd700;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
  width: 100%;
  max-width: 300px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.qianshi-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 48%, rgba(255, 215, 0, 0.1) 49%, rgba(255, 215, 0, 0.1) 51%, transparent 52%);
  animation: qianshiShimmer 3s linear infinite;
  pointer-events: none;
}

@keyframes qianshiShimmer {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.qian-symbol {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #ffd700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  animation: float 4s ease-in-out infinite;
}

.qian-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 10px;
  background: rgba(255, 215, 0, 0.1);
  padding: 5px 15px;
  border-radius: 20px;
  border: 1px solid #ffd700;
  display: inline-block;
}

.qian-rank {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 15px;
  padding: 5px 15px;
  border-radius: 20px;
  border: 1px solid;
  display: inline-block;
}

.qian-rank.rank-upper {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.2));
  border-color: #ffd700;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
}

.qian-rank.rank-middle {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 191, 255, 0.2));
  border-color: #00f0ff;
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.7);
}

.qian-rank.rank-lower {
  background: linear-gradient(135deg, rgba(255, 69, 0, 0.2), rgba(255, 99, 71, 0.2));
  border-color: #ff6347;
  color: #ff6347;
  text-shadow: 0 0 10px rgba(255, 99, 71, 0.7);
}

.qian-rank.rank-unknown {
  background: linear-gradient(135deg, rgba(128, 128, 128, 0.2), rgba(169, 169, 169, 0.2));
  border-color: #a9a9a9;
  color: #a9a9a9;
  text-shadow: 0 0 10px rgba(169, 169, 169, 0.7);
}

.qian-preview {
  font-style: italic;
  color: #00f0ff;
  font-size: 1rem;
  line-height: 1.4;
  padding: 10px;
  background: rgba(8, 8, 16, 0.3);
  border-radius: 8px;
  border-left: 3px solid #00f0ff;
}

/* 浮动动画 */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* 梅花易数卡片样式 */
.plumflower-card {
  width: 100%;
  background: linear-gradient(135deg, rgba(188, 19, 254, 0.1), rgba(0, 240, 255, 0.1));
  border: 2px solid #bc13fe;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 0 20px rgba(188, 19, 254, 0.2), 0 0 40px rgba(0, 240, 255, 0.1);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.plumflower-card:hover {
  box-shadow: 0 0 30px rgba(188, 19, 254, 0.3), 0 0 60px rgba(0, 240, 255, 0.2);
  transform: translateY(-2px);
}

.plumflower-header {
  margin-bottom: 1rem;
}

.plumflower-symbol {
  font-size: 3rem;
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #00ffff;
  animation: float 3s ease-in-out infinite;
}

.plumflower-details {
  color: #00f0ff;
}

.hexagram-yao {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.yao-label {
  font-size: 0.9rem;
  color: #bc13fe;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.yao-display {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.yao-symbol {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.yao-symbol.yang {
  color: #ff00ff;
  text-shadow: 0 0 10px #ff00ff;
  background: rgba(255, 0, 255, 0.1);
  border: 1px solid #ff00ff;
}

.yao-symbol.yin {
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00ffff;
}

.yao-symbol:hover {
  transform: scale(1.1);
}

.hexagram-number {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #ffd700;
  text-shadow: 0 0 5px #ffd700;
  font-weight: bold;
  background: rgba(255, 215, 0, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  border: 1px solid #ffd700;
}
</style>
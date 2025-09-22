<template>
  <div class="history-detail-view">
    <div class="cyber-header">
      <h1 class="cyber-title">历史记录详情</h1>
    </div>
    
    <div class="content">
      <div class="detail-container" v-if="currentRecord">
        <!-- 返回按钮 -->
        <div class="back-button">
          <button class="cyber-button secondary" @click="goBack">
            ← 返回历史记录
          </button>
        </div>
        
        <!-- 详情内容 -->
        <div class="detail-card">
          <div class="detail-header">
            <div class="detail-icon">{{ getResultIcon(currentRecord.type) }}</div>
            <div class="detail-type-date">
              <h2 class="detail-type">{{ getDivinationTypeName(currentRecord.type) }}</h2>
              <p class="detail-date">{{ formatDate(currentRecord.timestamp) }}</p>
            </div>
          </div>
          
          <div class="detail-content">
            <div class="detail-section" v-if="currentRecord.question">
              <h3>您的问题</h3>
              <p class="detail-question">{{ currentRecord.question }}</p>
            </div>
            
            <div class="detail-section">
              <h3>算卦结果</h3>
              <div class="detail-result" v-if="currentRecord.result">
                <div v-if="currentRecord.type === 'iChing'">
                  <p>卦象编号: {{ currentRecord.result.hexagram }}</p>
                  <p v-if="currentRecord.result.changingLines">变爻: {{ currentRecord.result.changingLines.filter(Boolean).length }} 个</p>
                  <!-- 显示六爻详情 -->
                  <div class="yao-details" v-if="currentRecord.details && currentRecord.details.yao">
                    <h4>六爻详情</h4>
                    <div class="yao-list">
                      <div 
                        v-for="(yao, index) in currentRecord.details.yao" 
                        :key="index" 
                        class="yao-item"
                        :class="{ changing: currentRecord.details.changingLines && currentRecord.details.changingLines[index] }"
                      >
                        <span class="yao-position">{{ getYaoPosition(index) }}</span>
                        <span class="yao-type">{{ getYaoTypeText(yao) }}</span>
                        <span class="yao-changing" v-if="currentRecord.details.changingLines && currentRecord.details.changingLines[index]">变爻</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="currentRecord.type === 'tarot'">
                  <p>抽到的牌:</p>
                  <ul class="tarot-cards-list">
                    <li v-for="(card, index) in currentRecord.result.cards" :key="index">
                      {{ getTarotCardName(card) }}
                    </li>
                  </ul>
                </div>
                <div v-else-if="currentRecord.type === 'qianShi'">
                  <p>签号: {{ currentRecord.result.signNumber }}</p>
                </div>
                <div v-else-if="currentRecord.type === 'plumFlower'">
                  <p>上卦: {{ currentRecord.result.upperYao.join('') }}</p>
                  <p>下卦: {{ currentRecord.result.lowerYao.join('') }}</p>
                  <p>卦象编号: {{ currentRecord.result.hexagram }}</p>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h3>结果解读</h3>
              <p class="detail-interpretation">{{ currentRecord.interpretation }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="no-record" v-else>
        <p>未找到记录</p>
        <button class="cyber-button" @click="goBack">返回历史记录</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHistoryStore } from '../store/history'
import { useDivinationStore } from '../store/divination'

const route = useRoute()
const router = useRouter()
const historyStore = useHistoryStore()
const divinationStore = useDivinationStore()

const recordId = route.params.id as string
const currentRecord = ref<any>(null)

onMounted(() => {
  if (recordId) {
    currentRecord.value = historyStore.records.find(r => r.id === recordId)
  }
})

const getDivinationTypeName = (typeId: string) => {
  const type = divinationStore.getDivinationTypeById(typeId)
  return type ? type.name : typeId
}

const getResultIcon = (typeId: string) => {
  const icons: Record<string, string> = {
    iChing: '🔮',
    tarot: '🃏',
    qianShi: '🎋',
    plumFlower: '🌸'
  }
  return icons[typeId] || '🔮'
}

const getTarotCardName = (card: any) => {
  // 如果卡片有name属性，直接使用
  if (card.name) {
    return card.name + (card.reversed ? ' (逆位)' : '');
  }
  
  // 大阿卡纳牌 (suit = -1)
  if (card.suit === -1) {
    const majorArcana = [
      "愚者", "魔术师", "女祭司", "皇后", "皇帝", "教皇", "恋人",
      "战车", "力量", "隐者", "命运之轮", "正义", "倒吊人", "死神",
      "节制", "恶魔", "塔", "星星", "月亮", "太阳", "审判", "世界"
    ]
    return (majorArcana[card.number] || `大阿卡纳${card.number}`) + (card.reversed ? ' (逆位)' : '');
  }
  
  // 小阿卡纳牌
  const suits = ['♣', '♦', '♥', '♠'];
  const suitSymbol = suits[card.suit] || '';
  
  let cardName = '';
  if (card.number === 1) {
    cardName = 'A';
  } else if (card.number > 1 && card.number <= 10) {
    cardName = card.number.toString();
  } else {
    const names = ["J", "Q", "K"];
    cardName = names[card.number - 11] || card.number.toString();
  }
  
  return `${suitSymbol}${cardName}` + (card.reversed ? ' (逆位)' : '');
}

const getYaoPosition = (index: number) => {
  const positions = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
  return positions[index]
}

const getYaoTypeText = (yao: number) => {
  // 2表示阳爻，3表示阴爻
  return yao === 2 ? '阳爻 (━━━━━)' : '阴爻 (━ ━ ━)'
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const goBack = () => {
  router.push('/history')
}
</script>

<style scoped lang="scss">
.history-detail-view {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c14 0%, #141428 100%);
}

.cyber-header {
  text-align: center;
  margin-bottom: 3rem;
}

.cyber-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #bc13fe, #00f0ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(188, 19, 254, 0.5);
  margin-bottom: 1rem;
}

.detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.back-button {
  margin-bottom: 2rem;
}

.detail-card {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(188, 19, 254, 0.3);
  backdrop-filter: blur(10px);
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(188, 19, 254, 0.3);
}

.detail-icon {
  font-size: 3rem;
  margin-right: 1.5rem;
}

.detail-type {
  color: #ff00ff;
  margin-bottom: 0.5rem;
}

.detail-date {
  color: #00f0ff;
  font-size: 1rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  color: #ff00ff;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.detail-question, .detail-interpretation {
  color: #00f0ff;
  line-height: 1.6;
  font-size: 1.1rem;
}

.detail-result {
  color: #00f0ff;
  font-size: 1.1rem;
}

.detail-result p {
  margin-bottom: 0.5rem;
}

.yao-details h4 {
  color: #ff00ff;
  margin: 1rem 0 0.5rem 0;
}

.yao-list {
  margin-top: 0.5rem;
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

.tarot-cards-list {
  list-style-type: none;
  padding: 0;
}

.tarot-cards-list li {
  margin-bottom: 0.3rem;
  padding: 0.2rem 0;
}

.no-record {
  text-align: center;
  color: #00f0ff;
  font-size: 1.2rem;
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
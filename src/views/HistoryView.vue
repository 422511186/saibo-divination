<template>
  <div class="history-view">
    <div class="cyber-header">
      <h1 class="cyber-title">历史记录</h1>
      <p class="cyber-subtitle">查看您的算卦历史</p>
    </div>
    
    <div class="content">
      <div class="history-container">
        <!-- 筛选器 -->
        <div class="filters">
          <div class="filter-group">
            <label for="type-filter">算卦类型:</label>
            <select id="type-filter" v-model="filterType">
              <option value="">全部</option>
              <option v-for="type in divinationTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          
          <div class="filter-actions">
            <button class="cyber-button secondary" @click="clearHistory">
              清空记录
            </button>
            <button class="cyber-button secondary" @click="goHome" style="margin-left: 1rem;">
              返回主页
            </button>
          </div>
        </div>
        
        <!-- 历史记录列表 -->
        <div class="history-list">
          <div 
            class="history-item" 
            v-for="record in filteredRecords" 
            :key="record.id"
          >
            <div class="item-header">
              <div class="item-type">{{ getDivinationTypeName(record.type) }}</div>
              <div class="item-date">{{ formatDate(record.timestamp) }}</div>
            </div>
            
            <div class="item-content">
              <div class="item-icon">{{ getResultIcon(record.type) }}</div>
              <div class="item-details">
                <div class="item-question" v-if="record.question">
                  <strong>问题:</strong> {{ record.question }}
                </div>
                <div class="item-result" v-if="record.result">
                  <strong>结果:</strong> 
                  <span v-if="record.type === 'tarot'">
                    <ul class="tarot-history-list">
                      <li v-for="(card, index) in record.result.cards" :key="index">
                        {{ getTarotCardName(card) }}
                      </li>
                    </ul>
                  </span>
                  <span v-else-if="record.type === 'iChing'">
                    卦象编号: {{ record.result.hexagram }}
                  </span>
                  <span v-else-if="record.type === 'qianShi'">
                    签号: {{ record.result.signNumber }}
                  </span>
                  <span v-else-if="record.type === 'plumFlower'">
                    卦象编号: {{ record.result.hexagram }}
                  </span>
                </div>
                <div class="item-interpretation">
                  <strong>解读:</strong> {{ record.interpretation }}
                </div>
              </div>
            </div>
            
            <div class="item-actions">
              <button class="cyber-button small" @click="viewDetails(record.id)">
                查看详情
              </button>
              <button class="cyber-button small secondary" @click="removeRecord(record.id)">
                删除
              </button>
            </div>
          </div>
          
          <div class="no-records" v-if="filteredRecords.length === 0">
            <p>暂无历史记录</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '../store/history'
import { useDivinationStore } from '../store/divination'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const historyStore = useHistoryStore()
const divinationStore = useDivinationStore()

const filterType = ref('')

const filteredRecords = computed(() => {
  if (!filterType.value) {
    return historyStore.records
  }
  return historyStore.records.filter(record => record.type === filterType.value)
})

const divinationTypes = computed(() => {
  return divinationStore.divinationTypes
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

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const viewDetails = (id: string) => {
  // 跳转到详情页面
  router.push(`/history/${id}`)
}

const removeRecord = (id: string) => {
  ElMessageBox.confirm(
    '确定要删除这条记录吗？',
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    historyStore.removeRecord(id)
  }).catch(() => {
    // 用户取消删除
  })
}

const clearHistory = () => {
  ElMessageBox.confirm(
    '确定要清空所有历史记录吗？',
    '确认清空',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    historyStore.clearHistory()
  }).catch(() => {
    // 用户取消清空
  })
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.history-view {
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

.cyber-subtitle {
  font-size: 1.2rem;
  color: #00f0ff;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.5);
}

.history-container {
  max-width: 1000px;
  margin: 0 auto;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #00f0ff;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group label {
  color: #ff00ff;
  font-weight: bold;
}

.filter-group select {
  background: rgba(8, 8, 16, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 5px;
  padding: 0.5rem;
  color: #00f0ff;
}

.filter-group select:focus {
  outline: none;
  border-color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
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

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-item {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 0 15px rgba(188, 19, 254, 0.2);
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(188, 19, 254, 0.3);
}

.item-type {
  color: #ff00ff;
  font-weight: bold;
}

.item-date {
  color: #00f0ff;
  font-size: 0.9rem;
}

.item-content {
  display: flex;
  margin-bottom: 1rem;
}

.item-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.item-details {
  flex: 1;
}

.item-question, .item-result, .item-interpretation {
  color: #00f0ff;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.item-question strong, .item-result strong, .item-interpretation strong {
  color: #ff00ff;
}

.tarot-history-list {
  list-style-type: none;
  padding: 0;
  margin: 0.2rem 0;
}

.tarot-history-list li {
  margin-bottom: 0.2rem;
}

.item-actions {
  display: flex;
  gap: 1rem;
}

.cyber-button.small {
  padding: 8px 15px;
  font-size: 0.9rem;
}

.no-records {
  text-align: center;
  color: #00f0ff;
  font-size: 1.2rem;
  padding: 3rem;
}
</style>
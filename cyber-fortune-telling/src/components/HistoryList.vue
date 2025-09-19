<template>
  <div class="history-list">
    <div 
      class="history-item" 
      v-for="record in records" 
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
          <div class="item-interpretation">
            <strong>解读:</strong> {{ record.interpretation }}
          </div>
        </div>
      </div>
      
      <div class="item-actions" v-if="showActions">
        <CyberButton 
          variant="secondary" 
          size="small" 
          @click="$emit('view', record.id)"
        >
          查看详情
        </CyberButton>
        <CyberButton 
          variant="ghost" 
          size="small" 
          @click="$emit('delete', record.id)"
        >
          删除
        </CyberButton>
      </div>
    </div>
    
    <div class="no-records" v-if="records.length === 0">
      <p>{{ emptyText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CyberButton from './CyberButton.vue'
import { useDivinationStore } from '../store/divination'
import type { DivinationRecord } from '../store/index'

interface Props {
  records: DivinationRecord[]
  showActions?: boolean
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  emptyText: '暂无历史记录'
})

const emit = defineEmits<{
  (e: 'view', id: string): void
  (e: 'delete', id: string): void
}>()

const divinationStore = useDivinationStore()

const getDivinationTypeName = (typeId: string) => {
  const type = divinationStore.getDivinationTypeById(typeId)
  return type ? type.name : typeId
}

const getResultIcon = (typeId: string) => {
  const icons: Record<string, string> = {
    iChing: '🔮',
    tarot: '🃏',
    qianShi: '🎋'
  }
  return icons[typeId] || '🔮'
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}
</script>

<style scoped lang="scss">
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

.item-question, .item-interpretation {
  color: #00f0ff;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.item-question strong, .item-interpretation strong {
  color: #ff00ff;
}

.item-actions {
  display: flex;
  gap: 1rem;
}

.no-records {
  text-align: center;
  color: #00f0ff;
  font-size: 1.2rem;
  padding: 2rem;
}
</style>
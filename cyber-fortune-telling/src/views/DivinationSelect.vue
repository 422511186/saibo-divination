<template>
  <div class="divination-select">
    <div class="cyber-header">
      <h1 class="cyber-title">选择算卦方式</h1>
      <p class="cyber-subtitle">选择您想要体验的算卦类型</p>
    </div>
    
    <div class="content">
      <div class="divination-grid">
        <div 
          class="divination-card" 
          v-for="type in divinationTypes" 
          :key="type.id"
          @click="selectDivination(type.id)"
        >
          <div class="card-icon">{{ getIcon(type.id) }}</div>
          <h3>{{ type.name }}</h3>
          <p>{{ type.description }}</p>
          <div class="card-process">{{ type.process }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDivinationStore } from '../store/divination'

const router = useRouter()
const store = useDivinationStore()

const divinationTypes = ref(store.divinationTypes)

const selectDivination = (typeId: string) => {
  router.push(`/divination/${typeId}/process`)
}

const getIcon = (typeId: string) => {
  const icons: Record<string, string> = {
    iChing: '🔮',
    tarot: '🃏',
    qianShi: '🎋'
  }
  return icons[typeId] || '🔮'
}
</script>

<style scoped lang="scss">
.divination-select {
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

.divination-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.divination-card {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(188, 19, 254, 0.2);
}

.divination-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 25px rgba(188, 19, 254, 0.5);
  border-color: #00f0ff;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.divination-card h3 {
  color: #ff00ff;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.divination-card p {
  color: #00f0ff;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
}

.card-process {
  color: #ffff00;
  font-size: 0.9rem;
  padding: 0.5rem;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 5px;
}
</style>
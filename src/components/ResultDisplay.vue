<template>
  <div class="result-display">
    <div class="result-header">
      <div class="result-icon">{{ icon }}</div>
      <h2 class="result-title">{{ title }}</h2>
    </div>
    
    <div class="result-content">
      <div class="result-main">
        <slot name="result"></slot>
      </div>
      
      <div class="result-interpretation">
        <h3>解读</h3>
        <p>{{ interpretation }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  interpretation: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.result-display {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(188, 19, 254, 0.3);
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(188, 19, 254, 0.3);
}

.result-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.result-title {
  color: #ff00ff;
  font-size: 1.8rem;
  margin: 0;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-main {
  background: rgba(8, 8, 16, 0.5);
  border: 1px solid #00f0ff;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-interpretation h3 {
  color: #ff00ff;
  margin-bottom: 0.5rem;
}

.result-interpretation p {
  color: #00f0ff;
  line-height: 1.6;
  font-size: 1.1rem;
}
</style>
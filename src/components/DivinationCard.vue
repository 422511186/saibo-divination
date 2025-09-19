<template>
  <div 
    class="divination-card" 
    :class="{ disabled }"
    @click="handleClick"
  >
    <div class="card-content">
      <div class="card-icon">{{ icon }}</div>
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>
      <div class="card-process">{{ process }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
  process: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped lang="scss">
.divination-card {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(188, 19, 254, 0.2);
  position: relative;
  overflow: hidden;
}

.divination-card:hover:not(.disabled) {
  transform: translateY(-5px);
  box-shadow: 0 5px 25px rgba(188, 19, 254, 0.5);
  border-color: #00f0ff;
}

.divination-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divination-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: 0.5s;
}

.divination-card:hover:not(.disabled)::before {
  left: 100%;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.card-title {
  color: #ff00ff;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.card-description {
  color: #00f0ff;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.4;
}

.card-process {
  color: #ffff00;
  font-size: 0.85rem;
  padding: 0.4rem;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 5px;
}
</style>
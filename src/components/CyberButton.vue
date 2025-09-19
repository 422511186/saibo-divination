<template>
  <button 
    class="cyber-button" 
    :class="[variant, size, { disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
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
.cyber-button {
  font-family: inherit;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  outline: none;
}

/* Variants */
.cyber-button.primary {
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  color: #0c0c14;
  box-shadow: 0 0 15px rgba(188, 19, 254, 0.5);
}

.cyber-button.secondary {
  background: transparent;
  border: 1px solid #00f0ff;
  color: #00f0ff;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}

.cyber-button.ghost {
  background: transparent;
  border: 1px solid #bc13fe;
  color: #bc13fe;
  box-shadow: 0 0 15px rgba(188, 19, 254, 0.2);
}

/* Sizes */
.cyber-button.small {
  padding: 8px 15px;
  font-size: 0.9rem;
  border-radius: 20px;
}

.cyber-button.medium {
  padding: 12px 25px;
  font-size: 1rem;
  border-radius: 30px;
}

.cyber-button.large {
  padding: 15px 35px;
  font-size: 1.1rem;
  border-radius: 35px;
}

/* Hover effects */
.cyber-button.primary:hover:not(.disabled) {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(188, 19, 254, 0.8);
}

.cyber-button.secondary:hover:not(.disabled) {
  background: rgba(0, 240, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0, 240, 255, 0.5);
}

.cyber-button.ghost:hover:not(.disabled) {
  background: rgba(188, 19, 254, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(188, 19, 254, 0.3);
}

/* Disabled state */
.cyber-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Active effect */
.cyber-button:active:not(.disabled) {
  transform: translateY(1px);
}

/* Glow effect */
.cyber-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.cyber-button:hover:not(.disabled)::before {
  left: 100%;
}
</style>
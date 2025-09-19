<template>
  <div class="cyber-animation" ref="animationContainer">
    <div class="animation-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

interface Props {
  animationType?: 'pulse' | 'float' | 'glitch' | 'scanline'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  animationType: 'pulse',
  duration: 2
})

const animationContainer = ref<HTMLElement | null>(null)
let animationInstance: gsap.core.Tween | null = null

const playAnimation = () => {
  if (!animationContainer.value) return

  switch (props.animationType) {
    case 'pulse':
      animationInstance = gsap.to(animationContainer.value, {
        scale: 1.05,
        opacity: 0.8,
        duration: props.duration,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      })
      break
      
    case 'float':
      animationInstance = gsap.to(animationContainer.value, {
        y: -10,
        duration: props.duration,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      })
      break
      
    case 'glitch':
      // 简化的故障效果
      animationInstance = gsap.to(animationContainer.value, {
        x: gsap.utils.random(-5, 5),
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
        ease: "steps(2)"
      })
      break
      
    case 'scanline':
      // 扫描线效果需要额外的元素
      break
  }
}

onMounted(() => {
  playAnimation()
})

onUnmounted(() => {
  if (animationInstance) {
    animationInstance.kill()
  }
})
</script>

<style scoped lang="scss">
.cyber-animation {
  position: relative;
}

/* 扫描线效果 */
.cyber-animation.scanline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
  animation: scan 3s linear infinite;
  z-index: 10;
}

@keyframes scan {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}

/* 发光效果 */
.cyber-animation.glow {
  box-shadow: 0 0 15px rgba(188, 19, 254, 0.5);
}

.cyber-animation.glow:hover {
  box-shadow: 0 0 25px rgba(188, 19, 254, 0.8);
}
</style>
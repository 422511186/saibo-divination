<template>
  <div class="cyber-3d-animation" ref="containerRef">
    <canvas ref="canvasRef" class="animation-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let animationId: number

// 初始化3D场景
const initScene = () => {
  if (!containerRef.value || !canvasRef.value) return

  // 创建场景
  scene = new THREE.Scene()
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 5
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  
  // 创建粒子系统
  createParticles()
  
  // 添加光线
  const ambientLight = new THREE.AmbientLight(0xbc13fe, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0x00f0ff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)
  
  // 开始动画循环
  animate()
}

// 创建粒子系统
const createParticles = () => {
  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    
    // 随机位置
    positions[i3] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = (Math.random() - 0.5) * 10
    positions[i3 + 2] = (Math.random() - 0.5) * 10
    
    // 霓虹色
    colors[i3] = Math.random() > 0.5 ? 0xbc / 255 : 0x00 / 255 // R
    colors[i3 + 1] = Math.random() > 0.5 ? 0x13 / 255 : 0xf0 / 255 // G
    colors[i3 + 2] = Math.random() > 0.5 ? 0xfe / 255 : 0xff / 255 // B
  }
  
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  
  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  })
  
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  // 旋转粒子
  if (particles) {
    particles.rotation.x += 0.001
    particles.rotation.y += 0.002
  }
  
  // 渲染场景
  renderer.render(scene, camera)
}

// 窗口大小调整
const onWindowResize = () => {
  if (!containerRef.value || !camera || !renderer) return
  
  camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
}

// 组件挂载时初始化
onMounted(() => {
  initScene()
  window.addEventListener('resize', onWindowResize)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped lang="scss">
.cyber-3d-animation {
  width: 100%;
  height: 100%;
  position: relative;
}

.animation-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
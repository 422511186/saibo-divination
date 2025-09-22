// 粒子系统工具

// 粒子配置接口
export interface ParticleConfig {
  type: 'sparkle' | 'magic' | 'glow' | 'firework'
  count: number
  duration: number
  color: string[]
  size: { min: number, max: number }
}

// 粒子类
class Particle {
  element: HTMLElement
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  
  constructor(container: HTMLElement, config: ParticleConfig) {
    this.element = document.createElement('div')
    this.element.className = 'particle'
    
    // 设置粒子样式
    const size = Math.random() * (config.size.max - config.size.min) + config.size.min
    this.element.style.width = `${size}px`
    this.element.style.height = `${size}px`
    this.element.style.borderRadius = '50%'
    this.element.style.position = 'absolute'
    this.element.style.pointerEvents = 'none'
    this.element.style.opacity = '0'
    this.element.style.willChange = 'transform, opacity' // 提示浏览器这些属性将会改变
    
    // 根据类型设置颜色
    const color = config.color[Math.floor(Math.random() * config.color.length)]
    if (!color) {
      throw new Error('Invalid color configuration');
    }
    
    switch(config.type) {
      case 'sparkle':
        this.element.style.background = `radial-gradient(circle, ${color}, transparent)`
        this.element.style.boxShadow = `0 0 5px ${color}`
        break
      case 'magic':
        this.element.style.background = color
        this.element.style.boxShadow = `0 0 10px ${color}`
        break
      case 'glow':
        this.element.style.background = `radial-gradient(circle, ${color}, transparent)`
        this.element.style.boxShadow = `0 0 15px ${color}`
        break
      case 'firework':
        this.element.style.background = color
        this.element.style.boxShadow = `0 0 8px ${color}`
        break
    }
    
    container.appendChild(this.element)
    
    // 初始化位置和速度
    this.x = container.offsetWidth / 2
    this.y = container.offsetHeight / 2
    this.vx = (Math.random() - 0.5) * 10
    this.vy = (Math.random() - 0.5) * 10
    
    // 生命值
    this.life = 1
    this.maxLife = config.duration
    
    // 根据类型设置不同的运动模式
    switch(config.type) {
      case 'sparkle':
        this.vx = (Math.random() - 0.5) * 4
        this.vy = (Math.random() - 0.5) * 4
        break
      case 'magic':
        const angle = Math.random() * Math.PI * 2
        const speed = 2 + Math.random() * 3
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed
        break
      case 'glow':
        this.vx = (Math.random() - 0.5) * 2
        this.vy = (Math.random() - 0.5) * 2
        break
      case 'firework':
        const fireworkAngle = Math.random() * Math.PI * 2
        const fireworkSpeed = 3 + Math.random() * 5
        this.vx = Math.cos(fireworkAngle) * fireworkSpeed
        this.vy = Math.sin(fireworkAngle) * fireworkSpeed
        break
    }
  }
  
  update(deltaTime: number) {
    this.x += this.vx * deltaTime
    this.y += this.vy * deltaTime
    this.life -= deltaTime
    
    // 使用 transform 来更新位置，避免重排
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`
    this.element.style.opacity = `${this.life / this.maxLife}`
  }
  
  isDead() {
    return this.life <= 0
  }
  
  destroy() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
  }
}

// 粒子系统类
export class ParticleSystem {
  private container: HTMLElement
  private particles: Particle[] = []
  private animationId: number | null = null
  private lastTime: number = 0
  private isActive: boolean = false
  
  constructor(container: HTMLElement) {
    this.container = container
    this.container.style.position = 'relative'
    this.container.style.overflow = 'hidden'
  }
  
  // 创建粒子
  create(config: ParticleConfig): void {
    // 限制粒子数量以提高性能
    const maxParticles = Math.min(config.count, 50)
    
    for (let i = 0; i < maxParticles; i++) {
      const particle = new Particle(this.container, config)
      this.particles.push(particle)
    }
    
    if (!this.isActive) {
      this.isActive = true
      this.lastTime = performance.now()
      this.animate()
    }
  }
  
  // 动画循环
  private animate() {
    const currentTime = performance.now()
    let deltaTime = (currentTime - this.lastTime) / 1000 // 转换为秒
    
    // 限制 deltaTime 以防止大的跳跃
    deltaTime = Math.min(deltaTime, 0.1)
    
    this.lastTime = currentTime
    
    // 更新所有粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]
      if (particle) {
        particle.update(deltaTime)
        
        if (particle.isDead()) {
          particle.destroy()
          this.particles.splice(i, 1)
        }
      }
    }
    
    // 继续动画循环
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate())
    } else {
      this.isActive = false
    }
  }
  
  // 销毁粒子系统
  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    
    // 销毁所有粒子
    this.particles.forEach(particle => particle.destroy())
    this.particles = []
    this.isActive = false
  }
}

// 工厂函数创建特定类型的粒子效果
export const createParticleEffect = (container: HTMLElement, type: ParticleConfig['type']) => {
  const system = new ParticleSystem(container)
  
  const configs: Record<ParticleConfig['type'], ParticleConfig> = {
    sparkle: {
      type: 'sparkle',
      count: 20, // 减少粒子数量
      duration: 2,
      color: ['#00f0ff', '#bc13fe', '#ff00ff'],
      size: { min: 2, max: 6 }
    },
    magic: {
      type: 'magic',
      count: 15, // 减少粒子数量
      duration: 3,
      color: ['#bc13fe', '#00f0ff', '#ffff00'],
      size: { min: 3, max: 8 }
    },
    glow: {
      type: 'glow',
      count: 10, // 减少粒子数量
      duration: 4,
      color: ['#00f0ff', '#bc13fe'],
      size: { min: 5, max: 15 }
    },
    firework: {
      type: 'firework',
      count: 30, // 减少粒子数量
      duration: 2,
      color: ['#ff00ff', '#00f0ff', '#bc13fe', '#ffff00'],
      size: { min: 2, max: 5 }
    }
  }
  
  system.create(configs[type])
  return system
}
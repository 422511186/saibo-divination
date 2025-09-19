import { gsap } from 'gsap'
import { ParticleSystem, createParticleEffect } from './particleSystem'

export class AnimationController {
  private container: HTMLElement
  private particleSystem: ParticleSystem | null = null
  
  constructor(container: HTMLElement) {
    this.container = container
  }
  
  // 洗牌动画
  async shuffleAnimation(duration: number = 1.5): Promise<void> {
    return new Promise(resolve => {
      // 创建洗牌粒子效果
      createParticleEffect(this.container, 'sparkle')
      
      // 牌堆3D旋转效果
      const cardPileElements = this.container.querySelectorAll('.card-back')
      gsap.to(cardPileElements, {
        rotationY: 360,
        rotationX: 20,
        duration: duration,
        ease: "power2.inOut",
        stagger: 0.1,
        onComplete: resolve
      })
    })
  }
  
  // 抽牌动画
  async drawCardAnimation(
    element: HTMLElement, 
    targetX: number, 
    targetY: number, 
    rotation: number,
    duration: number = 0.8
  ): Promise<void> {
    return new Promise(resolve => {
      // 创建抽牌粒子效果
      createParticleEffect(this.container, 'magic')
      
      // 螺旋式抽出动画
      gsap.fromTo(element, 
        { 
          x: 0, 
          y: 0, 
          rotation: 0,
          rotationZ: 0,
          scale: 1,
          opacity: 0
        },
        { 
          x: targetX, 
          y: targetY, 
          rotation: rotation,
          rotationZ: 360,
          scale: 1,
          opacity: 1,
          duration: duration,
          ease: "power2.out",
          onComplete: resolve
        }
      )
    })
  }
  
  // 翻牌动画
  async flipCardAnimation(
    element: HTMLElement, 
    duration: number = 0.8
  ): Promise<void> {
    return new Promise(resolve => {
      // 创建翻牌粒子效果
      createParticleEffect(this.container, 'glow')
      
      // 增强的3D翻牌效果
      gsap.to(element, {
        rotationY: 180,
        rotationX: 10,
        duration: duration,
        ease: "power2.out",
        onComplete: resolve
      })
    })
  }
  
  // 完成动画
  async completeAnimation(cards: HTMLElement[]): Promise<void> {
    return new Promise(resolve => {
      // 创建完成粒子效果
      createParticleEffect(this.container, 'firework')
      
      // 对所有卡片执行轻微的缩放和发光效果
      gsap.to(cards, {
        scale: 1.05,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        onComplete: () => {
          // 恢复原始大小
          gsap.to(cards, {
            scale: 1,
            duration: 0.3,
            ease: "power1.inOut",
            onComplete: resolve
          })
        }
      })
    })
  }
  
  // 销毁控制器
  destroy(): void {
    if (this.particleSystem) {
      this.particleSystem.destroy()
    }
  }
}
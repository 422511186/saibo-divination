// 赛博朋克风格动画效果工具

import { gsap } from 'gsap'

// 霓虹发光效果
export const neonGlow = (element: HTMLElement, color: string = '#bc13fe') => {
  gsap.to(element, {
    duration: 0.5,
    boxShadow: `0 0 15px ${color}, 0 0 30px ${color}`,
    ease: "power2.out"
  })
}

// 霓虹淡出效果
export const neonFade = (element: HTMLElement, color: string = '#bc13fe') => {
  gsap.to(element, {
    duration: 0.5,
    boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
    ease: "power2.out"
  })
}

// 数字故障效果
export const glitchEffect = (element: HTMLElement, duration: number = 0.5) => {
  const originalText = element.textContent || ''
  
  // 创建故障效果
  const glitchInterval = setInterval(() => {
    const glitchText = originalText
      .split('')
      .map(char => {
        if (Math.random() < 0.3) {
          return String.fromCharCode(33 + Math.floor(Math.random() * 94))
        }
        return char
      })
      .join('')
    
    element.textContent = glitchText
  }, 50)
  
  // 恢复原始文本
  setTimeout(() => {
    clearInterval(glitchInterval)
    element.textContent = originalText
  }, duration * 1000)
}

// 扫描线效果
export const scanlineEffect = (container: HTMLElement) => {
  const scanline = document.createElement('div')
  scanline.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: rgba(0, 240, 255, 0.3);
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
    z-index: 1000;
    pointer-events: none;
  `
  
  container.style.position = 'relative'
  container.appendChild(scanline)
  
  gsap.to(scanline, {
    y: container.offsetHeight,
    duration: 2,
    repeat: -1,
    ease: "none"
  })
  
  // 返回清理函数
  return () => {
    if (scanline.parentNode) {
      scanline.parentNode.removeChild(scanline)
    }
  }
}

// 粒子效果
export const particleEffect = (container: HTMLElement, count: number = 20) => {
  const particles: HTMLElement[] = []
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div')
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: #${Math.floor(Math.random() * 16777215).toString(16)};
      border-radius: 50%;
      pointer-events: none;
    `
    
    container.appendChild(particle)
    particles.push(particle)
    
    // 随机动画
    gsap.to(particle, {
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      opacity: 0,
      duration: Math.random() * 2 + 1,
      ease: "power2.out",
      onComplete: () => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      }
    })
  }
  
  // 返回清理函数
  return () => {
    particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle)
      }
    })
  }
}

// 全息投影效果
export const hologramEffect = (element: HTMLElement) => {
  // 添加全息投影样式
  element.style.cssText += `
    position: relative;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 240, 255, 0.5);
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  `
  
  // 创建扫描线
  const scanline = document.createElement('div')
  scanline.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.8), transparent);
    animation: scan 3s linear infinite;
  `
  
  element.appendChild(scanline)
  
  // 添加CSS动画
  const style = document.createElement('style')
  style.textContent = `
    @keyframes scan {
      0% { top: 0; }
      100% { top: 100%; }
    }
  `
  
  document.head.appendChild(style)
  
  // 返回清理函数
  return () => {
    if (scanline.parentNode) {
      scanline.parentNode.removeChild(scanline)
    }
    if (style.parentNode) {
      style.parentNode.removeChild(style)
    }
  }
}

// 数据流效果
export const dataStreamEffect = (container: HTMLElement, duration: number = 3) => {
  const stream = document.createElement('div')
  stream.style.cssText = `
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, #bc13fe, #00f0ff, transparent);
    box-shadow: 0 0 10px #bc13fe;
  `
  
  container.style.position = 'relative'
  container.style.overflow = 'hidden'
  container.appendChild(stream)
  
  gsap.to(stream, {
    y: container.offsetHeight,
    duration: duration,
    ease: "none",
    repeat: -1
  })
  
  // 返回清理函数
  return () => {
    if (stream.parentNode) {
      stream.parentNode.removeChild(stream)
    }
  }
}

// 脉冲效果
export const pulseEffect = (element: HTMLElement, color: string = '#bc13fe') => {
  gsap.to(element, {
    duration: 0.5,
    scale: 1.05,
    boxShadow: `0 0 20px ${color}`,
    ease: "power2.out",
    yoyo: true,
    repeat: 1
  })
}

// 光线流动效果
export const lightFlowEffect = (container: HTMLElement) => {
  const flow = document.createElement('div')
  flow.style.cssText = `
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(188, 19, 254, 0.3), transparent);
    pointer-events: none;
  `
  
  container.style.position = 'relative'
  container.style.overflow = 'hidden'
  container.appendChild(flow)
  
  gsap.to(flow, {
    x: '200%',
    duration: 2,
    ease: "none",
    repeat: -1
  })
  
  // 返回清理函数
  return () => {
    if (flow.parentNode) {
      flow.parentNode.removeChild(flow)
    }
  }
}
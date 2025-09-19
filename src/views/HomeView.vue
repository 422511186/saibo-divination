<template>
  <div class="home">
    <!-- 3D背景 -->
    <div class="home-3d-background">
      <CyberAnimation />
    </div>
    
    <!-- 主要内容 -->
    <div class="content">
      <div class="intro-card">
        <h2>欢迎来到赛博算卦</h2>
        <p>融合传统文化与现代科技的算卦体验</p>
        <router-link to="/divination" class="cyber-button">开始算卦</router-link>
        <!-- 添加测试页面链接 -->
        <!-- 隐藏塔罗牌动画测试按钮 -->
        <!-- <router-link to="/tarot-test" class="cyber-button secondary" style="margin-left: 1rem;">塔罗牌动画测试</router-link> -->
      </div>
      
      <div class="features">
        <div class="feature-card">
          <div class="feature-icon">🔮</div>
          <h3>易经六十四卦</h3>
          <p>传统易经算卦方法</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🃏</div>
          <h3>塔罗牌</h3>
          <p>78张塔罗牌随机抽取</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎋</div>
          <h3>签诗</h3>
          <p>传统签诗的数字化抽取</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔢</div>
          <h3>梅花易数</h3>
          <p>基于数字和时间的算卦方法</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CyberAnimation from '../components/CyberAnimation.vue'

// 特性列表
const features = ref([
  {
    icon: '🔮',
    title: '易经六十四卦',
    description: '传统易经算卦方法'
  },
  {
    icon: '🃏',
    title: '塔罗牌',
    description: '78张塔罗牌随机抽取'
  },
  {
    icon: '🎋',
    title: '签诗',
    description: '传统签诗的数字化抽取'
  },
  {
    icon: '🔢',
    title: '梅花易数',
    description: '基于数字和时间的算卦方法'
  }
])
</script>

<style scoped lang="scss">
.home-3d-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.3;
}

.home {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c14 0%, #141428 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 改为从顶部开始布局 */
  padding-top: 4rem; /* 添加顶部内边距以避免与固定导航栏重叠 */
  
  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: 3rem;
  }
}

.cyber-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.cyber-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(90deg, #bc13fe, #00f0ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(188, 19, 254, 0.5);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.cyber-subtitle {
  font-size: 1.2rem;
  color: #00f0ff;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.5);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

.intro-card {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem; /* 减小间隔 */
  box-shadow: 0 0 20px rgba(188, 19, 254, 0.3);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.intro-card h2 {
  color: #ff00ff;
  margin-bottom: 1rem;
}

.intro-card p {
  color: #00f0ff;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.cyber-button {
  display: inline-block;
  padding: 12px 30px;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  color: #0c0c14;
  font-weight: bold;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(188, 19, 254, 0.5);
  margin: 0 0.5rem;
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    margin: 0.5rem;
  }
}

.cyber-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(188, 19, 254, 0.8);
}

.cyber-button.secondary {
  background: transparent;
  border: 1px solid #00f0ff;
  color: #00f0ff;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}

.cyber-button.secondary:hover {
  background: rgba(0, 240, 255, 0.1);
  box-shadow: 0 5px 20px rgba(0, 240, 255, 0.5);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.feature-card {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #00f0ff;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
  backdrop-filter: blur(5px);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 240, 255, 0.4);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.feature-card h3 {
  color: #ff00ff;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
}

.feature-card p {
  color: #00f0ff;
  font-size: 0.9rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
}
</style>
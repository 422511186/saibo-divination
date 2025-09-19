<template>
  <header class="cyber-header">
    <div class="header-content">
      <router-link to="/" class="logo-text">赛博算卦</router-link>
      
      <nav class="navigation">
        <router-link 
          to="/" 
          class="nav-link" 
          :class="{ active: isActive('/') }"
        >
          首页
        </router-link>
        
        <router-link 
          to="/divination" 
          class="nav-link" 
          :class="{ active: isActive('/divination') }"
        >
          算卦
        </router-link>
        
        <router-link 
          to="/history" 
          class="nav-link" 
          :class="{ active: isActive('/history') }"
        >
          历史记录
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped lang="scss">
.cyber-header {
  background: rgba(8, 8, 16, 0.9);
  border-bottom: 1px solid #bc13fe;
  padding: 1rem 0;
  box-shadow: 0 0 15px rgba(188, 19, 254, 0.3);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }
}

.logo-text {
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(90deg, #bc13fe, #00f0ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(188, 19, 254, 0.5);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.navigation {
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.nav-link {
  color: #00f0ff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}

.nav-link:hover {
  color: #ff00ff;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
}

.nav-link.active {
  background: rgba(188, 19, 254, 0.2);
  color: #ff00ff;
  box-shadow: 0 0 10px rgba(188, 19, 254, 0.3);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
}
</style>
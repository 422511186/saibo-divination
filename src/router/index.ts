import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TarotTestView from '../views/TarotTestView.vue'
import TestView from '../views/TestView.vue'

// 导航守卫设置页面标题
const setTitle = (to: any) => {
  const titles: Record<string, string> = {
    'Home': '赛博算卦 - Cyber Fortune Telling',
    'DivinationSelect': '选择算卦方式 - 赛博算卦',
    'DivinationProcess': '算卦进行中 - 赛博算卦',
    'DivinationResult': '算卦结果 - 赛博算卦',
    'History': '历史记录 - 赛博算卦',
    'HistoryDetail': '历史记录详情 - 赛博算卦',
    'TarotTest': '塔罗牌测试 - 赛博算卦',
    'Test': '测试页面 - 赛博算卦',
    'RuleDetail': '占卜规则详情 - 赛博算卦'
  }
  
  const title = titles[to.name] || '赛博算卦 - Cyber Fortune Telling'
  document.title = title
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/divination',
    name: 'DivinationSelect',
    component: () => import('../views/DivinationSelect.vue')
  },
  {
    path: '/divination/:type/process',
    name: 'DivinationProcess',
    component: () => import('../views/DivinationProcess.vue')
  },
  {
    path: '/divination/:type/result',
    name: 'DivinationResult',
    component: () => import('../views/ResultView.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/HistoryView.vue')
  },
  {
    path: '/history/:id',
    name: 'HistoryDetail',
    component: () => import('../views/HistoryDetailView.vue')
  },
  {
    path: '/tarot-test',
    name: 'TarotTest',
    component: TarotTestView
  },
  {
    path: '/test',
    name: 'Test',
    component: TestView
  },
  {
    path: '/rule/:type',
    name: 'RuleDetail',
    component: () => import('../views/RuleDetailView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加导航守卫
router.afterEach((to) => {
  // 设置页面标题
  setTitle(to)
})

export default router
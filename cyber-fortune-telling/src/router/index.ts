import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TarotTestView from '../views/TarotTestView.vue'
import TestView from '../views/TestView.vue'

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
    path: '/tarot-test',
    name: 'TarotTest',
    component: TarotTestView
  },
  {
    path: '/test',
    name: 'Test',
    component: TestView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
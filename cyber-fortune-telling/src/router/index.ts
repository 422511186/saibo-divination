import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
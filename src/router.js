import { createRouter, createWebHistory } from 'vue-router'
import page1 from './components/pages/page1.vue'
import page2 from './components/pages/page2.vue'

const routes = [
  { path: '/', name: 'page1', component: page1 },
  { path: '/page2', name: 'page2', component: page2 },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

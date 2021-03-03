import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/POC',
    name: 'POC',
    component: () => import('../views/POC.vue')
  },
  {
    path: '/Scratchpad',
    name: 'Scratchpad',
    component: () => import('../views/Scratchpad.vue')
  },
  {
    path: '/ImageUploader',
    name: 'ImageUploader',
    component: () => import('../views/ImageUploader.vue'),
    props: true
  },
  {
    path: '/PerformanceTesting',
    name: 'PerformanceTesting',
    component: () => import('../views/PerformanceTesting.vue'),
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router

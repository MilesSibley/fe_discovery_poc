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
    path: '/About',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
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
    path: '/Form',
    name: 'Form',
    component: () => import('../views/Form.vue'),
    props: true
  },
  {
    path: '/IU-Form',
    name: 'IU-Form',
    component: () => import('../views/IU-Form.vue'),
    props: true
  },
  {
    path: '/ImageUploader',
    name: 'ImageUploader',
    component: () => import('../views/ImageUploader.vue'),
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router

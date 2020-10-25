import VueRouter from 'vue-router'
import Vue from 'vue'

import Register from '../views/Register.vue'
import Play from '../views/Play.vue'
import Login from '../views/Login.vue'
import Fleet from '../views/Fleet.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/:player/fleet',
    name: 'Fleet',
    component: Fleet
  },
  {
    path: '/:player/game/:gameId',
    name: 'Play',
    component: Play
  },
  { 
    path: '*', 
    redirect: '/login' 
  },
]

const router = new VueRouter({
  routes
})

export default router

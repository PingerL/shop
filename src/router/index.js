import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import Welcome from '@/components/welcome'

Vue.use(VueRouter)

  const routes = [
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',redirect:'/welcome',component:Home,children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:()=>import ('../components/users')},
      {path:'/roles',component:()=>import ('../components/root/roles.vue')},
      {path:'/rights',component:()=>import ('../components/root/rights.vue')}
    ]}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router

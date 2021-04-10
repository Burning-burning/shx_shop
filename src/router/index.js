import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../views/users/User.vue'
import Role from '../views/roles/Role.vue'
import Right from '../views/rights/Right.vue'
import Cate from '../views/goods/Cate.vue'
import Params from '../views/goods/Params.vue'
Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/roles',
        component: Role
      },
      {
        path: '/rights',
        component: Right
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/welcome',
        component: Welcome
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    next('/login')
  }
  next()
})

export default router

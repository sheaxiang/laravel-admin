export default [
  {
    path: '/adminUser',
    routes: [
      {
        layout: false,
        name: '登录',
        path: 'login',
        component: './AdminUser/login',
      },
      {
        name: '个人设置',
        path: 'settings',
        component: './AdminUser/AccountSettings',
      },
    ],
  },
  {
    path: '/dashboard',
    name: '首页',
    icon: 'smile',
    component: './Dashboard',
  },
  {
    path: '/auth',
    routes: [
      {
        path: 'adminUser',
        component: './Auth/AdminUser',
      },
      {
        path: 'permission',
        component: './Auth/Permission',
      },
      {
        path: 'role',
        component: './Auth/Role',
      },
      {
        path: 'log',
        component: './Auth/Log',
      },
      {
        path: 'menu',
        component: './Auth/Menu',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/auth',
    redirect: '/auth/adminUser',
  },

  //在这里添加路由

  {
    path: '/403',
    component: './403',
  },
  {
    component: './404',
  },
]

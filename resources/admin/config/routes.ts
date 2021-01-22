import otherRouters from './otherRoutes';
export default [
  {
    path: '/',
    component: './Layout/index',
    menu: {
      flatMenu: true,
    },
    routes: [
      {
        path: '/user',
        routes: [
          {
            layout: false,
            name: '登录',
            path: 'login',
            component: './User/login',
          },
          {
            name: '个人设置',
            path: 'settings',
            component: './User/AccountSettings',
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
        path: '/setting',
        routes: [
          {
            path: 'menu',
            component: './Setting/menu',
          },
        ],
      },
      {
        path: '/',
        redirect: '/dashboard',
      },
      ...otherRouters,
      {
        component: './404',
      },
    ],
  },
];

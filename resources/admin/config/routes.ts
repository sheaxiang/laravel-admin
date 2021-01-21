import otherRouters from './otherRoutes'

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
        layout: false,
        routes: [
          {
            path: '/user',
            routes: [
              {
                name: '登录',
                path: '/user/login',
                component: './User/login',
              },
            ],
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
      ...otherRouters
      /*{
        component: './404',
      },*/
    ],
  },
];

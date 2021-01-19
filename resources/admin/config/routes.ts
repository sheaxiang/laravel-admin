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
        path: '/admin',
        component: './Admin',
        exact: true,
        routes: [
          {
            path: '/admin/sub-page',
            component: './Dashboard',
          },
        ],
      },
      {
        path: '/tableList',
        component: './TableList',
      },
      {
        path: '/',
        redirect: '/dashboard',
      },

      /*{
        component: './404',
      },*/
    ],
  },
];

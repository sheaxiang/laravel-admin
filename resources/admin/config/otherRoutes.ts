export default [
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
]

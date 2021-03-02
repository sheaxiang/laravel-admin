import otherRouters from './otherRoutes';
export default [
  {
    path: '/',
    component: './Layout/index',
    menu: {
      flatMenu: true,
    },
    routes: [
      //最大程度自定义
      ...otherRouters,
    ],
  },
];

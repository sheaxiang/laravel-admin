import React from 'react';
import type {Settings as LayoutSettings, MenuDataItem} from '@ant-design/pro-layout';
import {PageLoading} from '@ant-design/pro-layout';
import {notification} from 'antd';
import type { RequestConfig, RunTimeLayoutConfig} from 'umi';
import {history, getDvaApp} from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type {ResponseError} from 'umi-request';
import {queryCurrent} from './services/user';
import defaultSettings from '../config/defaultSettings';
import * as Icon from '@ant-design/icons';

const IconMap = (icon: string) => {
  return React.createElement(Icon[icon] || React.Fragment, null);
};

const loopMenuItem = (menus: MenuDataItem[], permissions?: [] | boolean): MenuDataItem[] =>
  menus.map(({ icon, children, permission_id, ...item }) => {
    if (permissions && permission_id) {
      if (permissions.indexOf(permission_id) === -1) {
        return undefined;
      }
    }
    return {
      ...item,
      icon: icon && IconMap(typeof icon === "string" ? icon : ''),
      children: children && loopMenuItem(children, permissions),
    }
});

// 去除无children
const formatMenu = (menus: [] | undefined) => {
  return menus?.filter((item) => {
    if (!item) return ;

    const {children} = item;
    let count = 0;
    children?.forEach(v => {
      if (v === undefined) {
        count += 1;
      }
    })
    if (children.length === count && children.length !== 0) { //如果只有一层,则不需要去除
      return false
    }

    return formatMenu(children);
  })
}

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  menuData: MenuDataItem[];
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    // 请求出错会导致初始化数据为undefined
    try {
      return await queryCurrent();
    } catch (error) {
      history.push('/user/login');
    }

    return undefined;
  };

  let currentUser: API.CurrentUser = {};
  let menuData: MenuDataItem[] | undefined = [];
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    currentUser = await fetchUserInfo();
    menuData = currentUser?.menus;
  }

  return {
    fetchUserInfo,
    menuData,
    currentUser,
    settings: defaultSettings
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;

      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    menuDataRender: (menuData) => {
      const permissions = initialState?.currentUser?.permissions?.map(v => v.id);
      const dynamicMenus = initialState.menuData && loopMenuItem(initialState.menuData, initialState?.currentUser?.id != 1 && permissions);

      if (dynamicMenus) {
        menuData.push(...formatMenu(dynamicMenus));
      }

      return menuData;
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response, data } = error;

  if (response) {
    const {message} = data;
    const { status, url } = response;

    switch (status) {
      // 未登录,跳转到登录页面
      case 401: {
        notification.error({
          message: '登录过期,请重新登录!'
        });
        history.push('/user/login');
        break;
      }
      case 400: {
        notification.error({
          message
        });
        break;
      }
      case 403: {
        history.push('/403');
        break;
      }
      default: {
        const errorText = codeMessage[response.status];

        notification.error({
          message: `请求错误 ${status}: ${url}`,
          description: errorText,
        });
        break;
      }
    }
  }

  if (!response) {
    // eslint-disable-next-line no-console
    console.log(error);

    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

// 当前正在请求的数量
let requestCount: number = 0;

const loadRequestInterceptor = () => {
  // 显示loading
  if (requestCount === 0) {
    if (getDvaApp()) {
      // eslint-disable-next-line no-underscore-dangle
      getDvaApp()._store.dispatch({
        type: 'load/save',
        payload: {loading: true}
      });
    }
  }
  requestCount += 1;
};

function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

const authHeaderInterceptor = (  url: string, options: RequestOptionsInit ) => {
  const authHeader = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("admin_token") || ''}`
  }
  // https://github.com/umijs/umi-request/pull/118 如何是上传文件 则检测是否是formData,并删除content-type,让浏览器自己加
  if (isFormData(options.data)) {
    delete authHeader['Content-Type'];
  }
  return {
    url: `${url}`,
    options: { ...options , interceptors: true, headers: {...authHeader, ...options.headers}},
  };
}

// 响应拦截
async function loadResponseInterceptor(response) {
  requestCount -= 1;
  if (requestCount <= 0) {
    if (getDvaApp()) {
      // eslint-disable-next-line no-underscore-dangle
      getDvaApp()._store.dispatch({
        type: 'load/save',
        payload: {loading: false}
      });
    }
  }
  const data = await response.clone().json();
  if (data.status === true && data.message) {
    notification.success({
      message: data.message
    });
  }
  return data.data ? data?.data : response;
}

export const request: RequestConfig  = {
  prefix: "/api/admin",
  timeout: 10000, //10秒
  errorConfig: {
    adaptor: (resData, ctx) => {
      return {
        ...resData,
        success: resData.status,
        errorMessage: resData.message,
      };
    },
  },
  errorHandler,
  requestInterceptors: [loadRequestInterceptor, authHeaderInterceptor],
  responseInterceptors: [loadResponseInterceptor]
};

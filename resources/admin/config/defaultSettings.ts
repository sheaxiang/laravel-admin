import { Settings as LayoutSettings } from '@ant-design/pro-layout';
const { NODE_ENV } = process.env;

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '后台管理系统',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  host: NODE_ENV === 'development'? 'http://reactadmin.test' : '', //todo
  menu: {
    locale: false
  }
};

export default Settings;

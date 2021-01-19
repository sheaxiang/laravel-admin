import {Spin} from 'antd';
import { connect } from 'dva';

const Layout = ({ children, load }) => {
  return <>
    <Spin tip="加载中..." size="large" spinning={load.loading} style={{zIndex:9999}}>
      {children}
    </Spin>
  </>;
};
export default connect(({ load }) => ({
  load,
}))(Layout);

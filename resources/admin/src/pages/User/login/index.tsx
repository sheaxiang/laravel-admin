import {
  LockTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Link, history, useModel } from 'umi';
import Footer from '@/components/Footer';
import type { LoginParamsType } from '@/services/login';
import { login } from '@/services/login';
import styles from './index.less';

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */

const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as {
      redirect: string;
    };
    history.push(redirect || '/');
  }, 10);
};

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      setInitialState({ ...initialState, currentUser: userInfo, menuData : userInfo?.menus });
    }
  };

  const handleSubmit = async (values: LoginParamsType) => {
    // 登录
    await login({ ...values }).then((response) => {
      localStorage.setItem("admin_token", response.access_token);
    })
    // 请求数据
    await fetchUserInfo()
    // 跳转
    goto();
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              {/* <img alt="logo" className={styles.logo} src="/logo.svg" /> */}
              <span className={styles.title}>后台管理系统</span>
            </Link>
          </div>
          <div className={styles.desc}>后台管理系统</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: '登录',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as LoginParamsType);
            }}
          >
            <>
              <ProFormText
                name="name"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名必填！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockTwoTone className={styles.prefixIcon} />,
                }}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '密码必填！',
                  },
                ]}
              />
            </>
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

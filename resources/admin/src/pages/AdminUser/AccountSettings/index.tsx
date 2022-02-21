import React, {useEffect, useState} from 'react';

import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import BaseView from './components/base';
import PasswordView from './components/password';
import styles from './style.less';

const { Item } = Menu;

const AdminUserSetting = React.FC = () => {
  const [selectKey, setSelectKey] = useState('base')
  const [main, setMain] = useState<HTMLDivElement | undefined>(undefined)
  const [mode, setMode] = useState('inline')

  const menuMap = {
    base: '基本设置',
    password: '密码设置',
  };

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  const getRightTitle = () => {
    return menuMap[selectKey];
  };

  const renderChildren = () => {
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      case 'password':
        return <PasswordView />;
      default:
        break;
    }

    return null;
  };

  useEffect(() => {
    const resize = () => {
      if (!main) {
        return;
      }
      requestAnimationFrame(() => {
        if (!main) {
          return;
        }
        let mode: 'inline' | 'horizontal' = 'inline';
        const { offsetWidth } = main;
        if (main.offsetWidth < 641 && offsetWidth > 400) {
          mode = 'horizontal';
        }
        if (window.innerWidth < 768 && offsetWidth > 400) {
          mode = 'horizontal';
        }
        setMode(mode)
      });
    };

    window.addEventListener('resize', resize());
    // todo 卸载
    /*window.removeEventListener('resize', resize());*/
    resize();
  }, [])

  return (
    <GridContent>
      <div
        className={styles.main}
        ref={(ref) => {
          if (ref) {
            setMain(ref)
          }
        }}
      >
        <div className={styles.leftMenu}>
          <Menu
            mode={mode}
            selectedKeys={[selectKey]}
            onClick={({ key }) =>  setSelectKey(key as string)}
          >
            {getMenu()}
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{getRightTitle()}</div>
          {renderChildren()}
        </div>
      </div>
    </GridContent>
  );
}

export default AdminUserSetting;

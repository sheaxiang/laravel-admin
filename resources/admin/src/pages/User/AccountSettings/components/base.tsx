import {UploadOutlined} from '@ant-design/icons';
import {Button, Form, Input, Upload} from 'antd';
import React from 'react';
import styles from './BaseView.less';
import {useModel} from "@@/plugin-model/useModel";
import { update } from '@/services/user';
import { image } from '@/services/upload'

const BaseView: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const { currentUser } = initialState

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
         return initialState.getAvatar();
      }
      return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    }
    return '';
  }

  const handleFinish = async (values) => {
    await update(values);
    // 更新现有缓存信息
    setInitialState({ ...initialState, currentUser: {...initialState.currentUser, ...values} });
  };

  const uploadAvatar = async ({file}) => {
    const {url} = await image('avatar', file)

    const info = {...initialState.currentUser, avatar: url};
    //更新数据库头像字段
    await update(info);
    // 更新现有缓存信息
    setInitialState({ ...initialState, currentUser: info });
  }

  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>
        头像
      </div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false} customRequest={uploadAvatar}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={currentUser}
          hideRequiredMark
        >
          <Form.Item
            name="name"
            label={'登录名'}
            rules={[
              {
                required: true,
                message: '请输入登录名!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="user_name"
            label={'昵称'}
            rules={[
              {
                required: true,
                message: '请输入您的昵称!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              更新
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={getAvatarURL()} />
      </div>
    </div>
  );
}

export default BaseView;

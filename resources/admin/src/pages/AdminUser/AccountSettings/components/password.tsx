import {Button, Form, Input} from 'antd';
import React from 'react';
import styles from './BaseView.less';
import { updatePassword } from '@/services/user';

const PasswordView: React.FC = () => {
  const handleFinish = (values) => {
    updatePassword(values);
  };

  return (
    <div className={styles.baseView}>
      <div>
        <Form
          layout="horizontal"
          onFinish={handleFinish}
          hideRequiredMark
        >
          <Form.Item
            name="old_password"
            label={'原密码'}
            rules={[
              {
                required: true,
                message: '请输入原密码!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="password"
            label={'新密码'}
            rules={[
              {
                required: true,
                message: '请输入新密码!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label={'确认密码'}
            rules={[
              {
                required: true,
                message: '请输入确认密码!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('密码不一致');
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              更新
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}


export default PasswordView;

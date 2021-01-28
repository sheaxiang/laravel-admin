import React, {useEffect, useRef, useState} from 'react';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormSwitch,
  ProFormSelect,
} from '@ant-design/pro-form';
import {getInfo, create, update} from './service';
import {getList as getRoleList} from '../Role/service';
import {getList as getPermissionList} from '../Permission/service';
import type { TableListItem } from './data.d';
import {FormInstance} from "antd/es/form";
import {Form, Upload} from "antd";
import {PlusOutlined} from '@ant-design/icons';
import {image} from "@/services/upload";
import {useModel} from "@@/plugin-model/useModel";
export type UpdateFormProps = {
  onSubmit: () => Promise<void>;
  updateModalVisible: boolean;
  handleModalVisible: boolean;
  id: number;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const formRef = useRef<FormInstance>(null!);
  const {id, updateModalVisible} = props;
  const [imageUrl, setImageUrl] = useState('');
  const { initialState } = useModel('@@initialState');
  const { settings } = initialState;

  useEffect(() => {
    if (!formRef) return;

    if (id) {
      getInfo(id).then((res: TableListItem) => {
        formRef.current.setFieldsValue({...res, roles: res?.roles.map(v => v.id), permissions: res?.permissions.map(v => v.id)});

        //页面显示
        setImageUrl(settings.host + res.avatar);
      })
    } else {
      formRef.current.resetFields();

      //页面显示
      setImageUrl('');
    }

  }, [updateModalVisible]);

  const onSubmit = async (value) => {
    try {
      if (id) {
        await update(id, value);
      } else {
        await create(value);
      }
    } catch (e) {
      return false;
    }

    await props.onSubmit();
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  const requestRolesList = async () => {
    const res = await getRoleList();

    let roles = [];
    res.forEach(v => {
      roles.push({
        label: v.name,
        value: v.id,
      });
    })

    return roles;
  }

  const requestPermissionsList = async () => {
    const res = await getPermissionList();

    let permissions = [];
    res.forEach(v => {
      permissions.push({
        label: v.name,
        value: v.id,
      });
    })

    return permissions;
  }

  const uploadAvatar = async ({file}) => {
    const {url} = await image('avatar', file)
    //form赋值
    formRef.current.setFieldsValue({avatar: url});

    //页面显示
    setImageUrl(settings.host + url);
  }

  return (
    <ModalForm
      formRef={formRef}
      title={id ? '编辑' : '新建'}
      visible={props.updateModalVisible}
      onVisibleChange={props.handleModalVisible}
      onFinish={onSubmit}
    >

      <ProForm.Group>
        <ProFormText name="name" label="登录名" width="md" rules={[
          {
            required: true,
            message: '登录名必填',
          },
        ]}/>
        <ProFormText name="user_name" label="昵称" width="md" rules={[
          {
            required: true,
            message: '用户名必填',
          },
        ]}/>
        <ProFormText.Password name="password" label="密码" width="md" placeholder={id ? '填入及代表修改密码' : '请输入密码'} rules={id ? [] : [
          {
            required: true,
            message: '密码必填',
          },
        ]}/>
      </ProForm.Group>

      <ProForm.Group>
        <Form.Item
          name="avatar"
          label={'头像'}
        >
          <Upload
            listType="picture-card"
            showUploadList={false}
            customRequest={uploadAvatar}
            accept="image/*"
            fileList={[]}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>

        <ProFormSwitch name="status" label="是否禁用" initialValue={false} />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="roles"
          label="角色"
          mode="multiple"
          params={{}}
          valueType="select"
          request={requestRolesList}
          allowClear
          placeholder="请选择角色"
        />
        <ProFormSelect
          width="md"
          name="permissions"
          label="权限"
          mode="multiple"
          params={{}}
          valueType="select"
          request={requestPermissionsList}
          allowClear
          placeholder="请选择权限"
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;

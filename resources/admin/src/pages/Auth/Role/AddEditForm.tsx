import React, {useMemo, useEffect, useRef, useState} from 'react';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-form';
import {getInfo, create, update} from './service';
import {getList as getPermissionList} from '../Permission/service';
import type { TableListItem } from './data.d';
import {FormInstance} from "antd/es/form";
import {Form, Transfer, TreeSelect} from 'antd';
export type UpdateFormProps = {
  onSubmit: () => Promise<void>;
  updateModalVisible: boolean;
  handleModalVisible: boolean;
  id: number;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const formRef = useRef<FormInstance>(null!);
  const {id, updateModalVisible} = props;
  const [permissionList, setPermissionList] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  useEffect(() => {
    if (id) {
      getInfo(id).then((res: TableListItem) => {
        formRef.current.setFieldsValue(res);

        setTargetKeys(res?.permissions?.map(v => v.id));
      })
    } else {
      formRef.current.resetFields();
      setTargetKeys([]);
    }

    getPermissionList().then(v => {
      setPermissionList(v)
    })
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

    return await props.onSubmit();
  }

  const onChange = (targetKeys) => {
    setTargetKeys(targetKeys);
  }

  const handleModalVisible = (visible) => {
    return visible && props.handleModalVisible;
  }

  return (
    <ModalForm
      formRef={formRef}
      title={id ? '编辑' : '新建'}
      visible={props.updateModalVisible}
      onVisibleChange={handleModalVisible}
      onFinish={onSubmit}
    >
      <ProForm.Group>
        <ProFormText name="slug" label="标识" width="md" rules={[
          {
            required: true,
            message: '标识必填',
          },
        ]}/>
        <ProFormText name="name" label="名称" width="md" rules={[
          {
            required: true,
            message: '名称必填',
          },
        ]}/>
      </ProForm.Group>

      <Form.Item
        label="权限"
        name="permissions"
      >
        <Transfer
          dataSource={permissionList}
          rowKey={record => record.id}
          titles={['可选', '已选']}
          showSearch
          targetKeys={targetKeys}
          onChange={onChange}
          render={item => `${item.name}-${item.slug}`}
          listStyle={{
            width: '100%',
          }}
        />
      </Form.Item>

    </ModalForm>
  );
};

export default UpdateForm;

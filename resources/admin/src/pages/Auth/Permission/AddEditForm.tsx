import React, {useMemo, useEffect, useRef, useState} from 'react';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-form';
import {getInfo, create, update} from './service';
import type { TableListItem } from './data.d';
import {FormInstance} from "antd/es/form";
export type UpdateFormProps = {
  onSubmit: () => Promise<void>;
  updateModalVisible: boolean;
  handleModalVisible: boolean;
  id: number;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const formRef = useRef<FormInstance>(null!);
  const {id, updateModalVisible} = props;

  useEffect(() => {
    if (id) {
      getInfo(id).then((res: TableListItem) => {
        formRef.current.setFieldsValue(res);
      })
    } else {
      formRef.current.resetFields();
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

    return await props.onSubmit();
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

      <ProFormSelect
        name="http_method"
        label="HTTP方法"
        mode="multiple"
        initialValue={[]}
        allowClear
        valueEnum={{
          GET: 'GET',
          POST: 'POST',
          PUT: 'PUT',
          DELETE: 'DELETE',
          PATCH: 'PATCH',
          OPTIONS: 'OPTIONS',
          HEAD: 'HEAD',
        }}
        placeholder="为空默认为所有方法"
      />

      <ProFormTextArea
        name="http_path"
        label="HTTP路径"
        placeholder="请输入HTTP路径称"
      />

    </ModalForm>
  );
};

export default UpdateForm;

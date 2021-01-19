import React from 'react';
import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import type { TableListItem } from '../data.d';
export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<TableListItem>;
export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  handleModalVisible: boolean;
  values: Partial<TableListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {


  return (
    <ModalForm
      title={'新建规则'}
      visible={props.updateModalVisible}
      onVisibleChange={props.handleModalVisible}
      onFinish={props.onSubmit}
    >
      <ProFormText name="name" label="名称" rules={[
        {
          required: true,
          message: '规则名称为必填项',
        },
      ]}/>
    </ModalForm>
  );
};

export default UpdateForm;

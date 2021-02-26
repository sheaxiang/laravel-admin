import React, {useMemo, useEffect, useRef, useState} from 'react';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormSwitch,
  ProFormSelect,
} from '@ant-design/pro-form';
import { TreeSelect, Form, Row, Col } from 'antd';
import * as Icon from '@ant-design/icons';
import {getInfo, create, update} from './service';
import {getList as getPermissionList} from '../../Auth/Permission/service';
import type { TableListItem } from './data.d';
import {FormInstance} from "antd/es/form";
import {undefinedToString} from "@/utils/utils";
export type UpdateFormProps = {
  onSubmit: () => Promise<void>;
  updateModalVisible: boolean;
  handleModalVisible: () => Promise<void>;
  id: number;
  data: []
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const formatIcon = () => {
    const iconBC = (name: string) => {
      const dynamicIcon = React.createElement(Icon[name]);
      return (
        <div>{name} {dynamicIcon}</div>
      );
    }
    const iconList = {};
    // todo
    Object.keys(Icon).forEach(v => {
      iconList[v] = iconBC(v);
    })
    delete iconList.setTwoToneColor;
    delete iconList.getTwoToneColor;

    return iconList
  }
  function formatTree(data) {
    let len = data?.length;
    for (let i = 0; i < len; i+=1) {
      if (props.id && data[i].id === props.id) {
        data.splice(i,1);
        // https://blog.csdn.net/XuM222222/article/details/82656144
        i-=1;
        len-=1;
        // eslint-disable-next-line no-continue
        continue;
      }
      // eslint-disable-next-line no-param-reassign
      data[i].title = data[i].name;
      // eslint-disable-next-line no-param-reassign
      data[i].value = data[i].id;
      if (data[i]?.children?.length === 0) {
        // eslint-disable-next-line no-param-reassign
        data[i].children = undefined;
      } else {
        formatTree(data[i].children);
      }
    }

    return data;
  }

  const formRef = useRef<FormInstance>(null!);
  const {id, updateModalVisible} = props;
  const iconList = useMemo(() => formatIcon, []);

  useEffect(() => {
    if (!formRef) return;

    if (id) {
      getInfo(id).then((res: TableListItem) => {
        formRef.current.setFieldsValue(res);
      })
    } else {
      formRef.current.resetFields();
    }

  }, [updateModalVisible]); // todo 自己维护状态

  const requestPermissionList = async () => {
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

  const onSubmit = async () => {
    const values = undefinedToString(formRef.current.getFieldsValue());

    try {
      if (id) {
        await update(id, values);
      } else {
        await create(values);
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
      <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="上级"
              name="parent_id"
            >
              <TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={formatTree(props.data)}
                allowClear
                placeholder="请选择上级"
                treeDefaultExpandAll
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <ProFormSelect
              name="permission_id"
              style={{ width: '50%' }}
              label="权限"
              valueType="select"
              request={requestPermissionList}
              allowClear
              placeholder="请选择权限"
            />
          </Col>
      </Row>

      <ProForm.Group>
        <ProFormText name="name" label="名称" width="md" rules={[
          {
            required: true,
            message: '菜单名称必填',
          },
        ]}/>

        <ProFormText name="path" label="路径" width="md" placeholder="路径需在routes.ts中存在" rules={[
          {
            required: true,
            message: '路径必填',
          },
        ]}/>
      </ProForm.Group>

      <ProForm.Group>
        <ProFormDigit label="排序" name="order" width="sm" initialValue={1} min={1} />
        {/* 这里不使用bool的原因是在列表后端返回也是bool,导致无法显示和筛选 */}
        <ProFormSwitch name="is_hide" label="是否隐藏" initialValue={0} />
        <ProFormSelect
          showSearch
          name="icon"
          label="图标"
          width="sm"
          valueEnum={iconList}
          placeholder="请选择图标"
        >
        </ProFormSelect>

      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;

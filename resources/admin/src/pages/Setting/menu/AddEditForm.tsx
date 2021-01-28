import React, {useMemo, useEffect, useRef, useState} from 'react';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormSwitch,
  ProFormSelect,
} from '@ant-design/pro-form';
import { TreeSelect, Form } from 'antd';
import * as Icon from '@ant-design/icons';
import {getInfo, create, update, getList} from './service';
import type { TableListItem } from './data.d';
import {FormInstance} from "antd/es/form";
export type UpdateFormProps = {
  onSubmit: () => Promise<void>;
  updateModalVisible: boolean;
  handleModalVisible: boolean;
  id: number;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [treeData, setTreeData] = useState([]);

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
    getList().then(res => {
      setTreeData(formatTree(res));
    })
  }, [updateModalVisible]); // todo 自己维护状态

  const onSubmit = async (value) => {
    if (id) {
      await update(id, value);
    } else {
      await create(value);
    }

    await props.onSubmit();
  }

  return (
    <ModalForm
      formRef={formRef}
      title={id ? '编辑' : '新建'}
      visible={props.updateModalVisible}
      onVisibleChange={props.handleModalVisible}
      onFinish={onSubmit}
    >
      <Form.Item
        label="上级"
        name="parent_id"
      >
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="请选择上级"
          treeDefaultExpandAll
        />
      </Form.Item>

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
        {/*这里不使用bool的原因是在列表后端返回也是bool,导致无法显示和筛选*/}
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

import React, {useEffect, useRef, useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { getList } from './service';
import {getList as getAdminList} from "@/pages/Auth/AdminUser/service";
import { Select } from 'antd';

const Permission: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [adminOption, setAdminOption] = useState([]);

  useEffect( () => {
      getAdminList().then(res => {
        const options = [];
        res.forEach(v => {
          options.push({label:v.user_name, value:v.id})
        });
        setAdminOption(options)
      });
  }, [])

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '管理员',
      key: 'user_id',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }

        return <Select
          {...rest}
          showSearch
          allowClear
          placeholder="请选择"
          options={adminOption}
        />;
      }
    },
    {
      title: '管理员名称',
      dataIndex: 'user.user_name',
      valueType: 'text',
      hideInSearch: true,
      renderText: (text, record) => {
        return record?.user?.user_name
      }
    },{
      title: '路径',
      dataIndex: 'path',
      valueType: 'text'
    },{
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
      hideInSearch: true
    },{
      title: 'ip',
      dataIndex: 'ip',
      valueType: 'text'
    },{
      title: '提交内容',
      dataIndex: 'input',
      valueType: 'text',
      hideInSearch: true,
      render: (_, row) => {
        return <pre style={{color: 'brown'}}>{JSON.stringify(JSON.parse(row.input), null, 4)}</pre>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInSearch: true
    }
  ];
  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle={'日志列表'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          const res = await getList({...params, page: params.current});
          return {
            data: res?.data,
            success: true,
            total: res?.total
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default Permission;

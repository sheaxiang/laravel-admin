import {PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, message, Tag} from 'antd';
import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import AddEditForm from './AddEditForm';
import type {TableListItem} from './data.d';
import {getList} from './service';

/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * 分布更新窗口的弹窗
   */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '登录名',
      dataIndex: 'name',
      valueType: 'text'
    },{
      title: '昵称',
      dataIndex: 'user_name',
      valueType: 'text'
    },
    {
      title: '角色',
      dataIndex: 'roles',
      hideInSearch: true,
      renderText: (text) => {
        return (
          <>
            {
              text?.map(v => <Tag color="green" key={v.id}>{v.name}</Tag>)
            }
          </>
        );
      }
    },
    {
      title: '是否禁用',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '否', status: 'Success' },
        1: { text: '是', status: 'Error' }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, row) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(row);
          }}
        >
          编辑
        </a>
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle={'管理员列表'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleUpdateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const res = await getList({...params, page: params.current});
          return {
            data: res?.data,
            success: true,
            total: res?.total
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      <AddEditForm
        onSubmit={async () => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);

          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
        handleModalVisible={(visible) => {
          handleUpdateModalVisible(visible);
          return !visible && setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        id={(currentRow && currentRow.id) || undefined}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;

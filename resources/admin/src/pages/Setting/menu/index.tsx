import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import AddEditForm from './AddEditForm';
import type { TableListItem } from './data.d';
import { getList } from './service';
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
  /**
   * 国际化配置
   */

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text'
    },{
      title: '排序',
      hideInSearch: true,
      dataIndex: 'order',
      valueType: 'digit',
    },{
      title: '路径',
      dataIndex: 'path',
      valueType: 'text',
    },
    {
      title: '是否隐藏',
      dataIndex: 'is_hide',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '否', status: 'Default' },
        1: { text: '是', status: 'Default' }
      },
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
        headerTitle={'菜单列表'}
        actionRef={actionRef}
        rowKey="id"
        pagination={false}
        expandable={{
          defaultExpandAllRows: true,
        }}
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
          function formatTree(data) {
            for (let i = 0; i < data?.length; i+=1) {
              if (data[i]?.children?.length === 0) {
                // eslint-disable-next-line no-param-reassign
                data[i].children = undefined;
              } else {
                formatTree(data[i].children);
              }
            }

            return data;
          }
          const data = await getList(params);
          return {
            data: formatTree(data),
            success: true
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
        handleModalVisible={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
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

export type TableListItem = {
  id?: number;
  name?: string;
  user_name?: string;
  status?: number;
  avatar?: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  name?: string;
  pageSize?: number;
  page?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

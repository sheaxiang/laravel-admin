export type TableListItem = {
  id?: number;
  _lft?: number;
  _rgt?: number;
  parent_id?: number;
  name?: string;
  order?: number;
  is_hide: boolean;
  icon?: string;
  path?: string;
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
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

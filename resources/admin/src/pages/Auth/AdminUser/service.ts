import { request } from 'umi';
import type { TableListParams, TableListItem } from './data.d';

export async function getList(params?: TableListParams) {
  return request('/admin_user', {
    params,
  });
}

export async function getInfo(id: number) {
  return request(`/admin_user/${id}`);
}

export async function create(params: TableListItem) {
  return request('/admin_user', {
    method: 'POST',
    data: params,
  });
}

export async function update(id: number, params: TableListParams) {
  return request(`/admin_user/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function destroy(params: { key: number[] }) {
  return request('/admin_user', {
    method: 'delete',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

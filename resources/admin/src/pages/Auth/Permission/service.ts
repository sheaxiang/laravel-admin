import { request } from 'umi';
import type { TableListParams, TableListItem } from './data.d';

export async function getList(params?: TableListParams) {
  return request('/permission', {
    params,
  });
}

export async function getInfo(id: number) {
  return request(`/permission/${id}`);
}

export async function create(params: TableListItem) {
  return request('/permission', {
    method: 'POST',
    data: params,
  });
}

export async function update(id: number, params: TableListParams) {
  return request(`/permission/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function destroy(params: { key: number[] }) {
  return request('/permission', {
    method: 'delete',
    data: params,
  });
}

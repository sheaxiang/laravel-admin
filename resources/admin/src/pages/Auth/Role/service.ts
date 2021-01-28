import { request } from 'umi';
import type { TableListParams, TableListItem } from './data.d';

export async function getList(params?: TableListParams) {
  return request('/role', {
    params,
  });
}

export async function getInfo(id: number) {
  return request(`/role/${id}`);
}

export async function create(params: TableListItem) {
  return request('/role', {
    method: 'POST',
    data: params,
  });
}

export async function update(id: number, params: TableListParams) {
  return request(`/role/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function destroy(params: { key: number[] }) {
  return request('/role', {
    method: 'delete',
    data: params,
  });
}

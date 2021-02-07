import { request } from 'umi';
import type { TableListParams, TableListItem } from './data.d';

export async function getList(params?: TableListParams) {
  return request('/menu', {
    params,
  });
}

export async function getInfo(id: number) {
  return request(`/menu/${id}`);
}

export async function create(params) {
  return request('/menu', {
    method: 'POST',
    data: params,
  });
}

export async function update(id: number, params: TableListParams) {
  return request(`/menu/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function destroy(params: { key: number[] }) {
  return request('/menu', {
    method: 'delete',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

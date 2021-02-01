import { request } from 'umi';
import type { TableListParams } from './data.d';

export async function getList(params?: TableListParams) {
  return request('/logs', {
    params,
  });
}

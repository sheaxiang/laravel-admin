import { request } from 'umi';

export async function index() {
  return request('/menu');
}

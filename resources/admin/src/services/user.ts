import { request } from 'umi';

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/user');
}

export async function update(params) {
  return request('/user', {
    method: 'PUT',
    data: params,
  });
}

export async function updatePassword(params) {
  return request('/updatePassword', {
    method: 'PUT',
    data: params,
  });
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}

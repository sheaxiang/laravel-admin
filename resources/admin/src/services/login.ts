import { request } from 'umi';

export type LoginParamsType = {
  name: string;
  password: string;
};

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function login(params: LoginParamsType) {
  return request<API.LoginStateType>('/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/logout');
}

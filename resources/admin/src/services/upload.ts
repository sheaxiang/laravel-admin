import { request } from 'umi';

export async function image(type: string, file) {
  const formData = new FormData();
  formData.append('image', file);

  return request(`/upload/image/${type}`, {
    method: 'POST',
    data: formData,
  });
}

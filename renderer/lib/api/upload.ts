import { v1, getHeader, http } from './utils';

export const deleteUploadRaw = (id: string, req?: any) =>
  http(v1(`upload/raw/${id}`), {
    method: 'DELETE',
    headers: getHeader(req),
  });

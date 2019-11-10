import { v1, getHeader, http } from './utils';

export const deleteUploadRaw = (id: string, req?: any) =>
  http(v1(`upload/raw/${id}`), {
    method: 'DELETE',
    headers: getHeader(req),
  });

export const uploadRaw = (payload: string | FormData, req?: any) =>
  http(v1(`upload/video-record`), {
    method: 'POST',
    headers: getHeader(req, null),
    body: payload,
  });

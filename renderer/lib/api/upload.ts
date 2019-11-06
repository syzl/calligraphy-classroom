import fetch from 'isomorphic-unfetch';
import { v1, getHeader } from './utils';

export const deleteUploadRaw = (id: string, req?: any) =>
  fetch(v1(`upload/raw/${id}`), {
    method: 'DELETE',
    headers: getHeader(req),
  });

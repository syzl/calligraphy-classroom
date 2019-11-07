import { v1, getHeader, http } from './utils';

export const deleteVideoRelation = (id: string | number, req?: any) =>
  http(v1(`demonstrate/video/${id}`), {
    method: 'DELETE',
    headers: getHeader(req),
  });

import { v1, getHeader, http } from './utils';

export const deleteVideoRelation = (id: string | number, req?: any) =>
  http(v1(`demonstrate/video/${id}`), {
    method: 'DELETE',
    headers: getHeader(req),
  });

export const relateCourse = (
  id: string | number,
  courseId: string | number,
  req?: any,
) =>
  http(v1(`demonstrate/${id}/course/${courseId}`), {
    method: 'PUT',
    headers: getHeader(req),
  });

export const videoRelateDemon = (
  id: string | number,
  demonId: string | number,
  req?: any,
) =>
  http(v1(`demonstrate/video/${id}/demon/${demonId}`), {
    method: 'PUT',
    headers: getHeader(req),
  });

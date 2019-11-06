import { normalize } from 'path';
import { SERVER_URL } from '../constant';
import { getToken } from '../utils';

export function v1(path: string): string {
  return `${SERVER_URL}${normalize(`/api/v1/${path}`)}`;
}

export function getHeader(req?: any) {
  const token = getToken(req);
  return {
    'content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

import { normalize } from 'path';
import fetch from 'isomorphic-unfetch';
import { SERVER_URL } from '../constant';
import { getToken } from '../utils';

export function v1(path: string): string {
  return `${SERVER_URL}${normalize(`/api/v1/${path}`)}`;
}

export function getHeader(
  req?: any,
  contentType: string | null = 'application/json',
) {
  const token = getToken(req);
  return {
    ...(contentType ? { 'content-type': contentType } : null),
    Authorization: `Bearer ${token}`,
  };
}

export async function http(input: RequestInfo, init?: RequestInit) {
  try {
    const data = await fetch(input, init).then(res => res.json());
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

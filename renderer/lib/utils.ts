import { DepTrackingCache } from 'apollo-cache-inmemory/lib/depTrackingCache';
import cookie from 'cookie';

export function hasErrors(fieldsError: any) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

export function wait(time = 20) {
  return new Promise(r => setTimeout(r, time));
}

export function getDepCache(proxy: any): DepTrackingCache {
  return proxy && (proxy.data as DepTrackingCache);
}
/**
 * Get the user token from cookie
 * @param {Object} req
 */
export function getToken(req?: any) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || '' : document.cookie,
  );
  let fallback = '';
  if (typeof window !== undefined) {
    fallback = window.localStorage.getItem('token') || '';
  }
  return cookies.token || fallback;
}

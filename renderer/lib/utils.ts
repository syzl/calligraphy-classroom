import { DepTrackingCache } from 'apollo-cache-inmemory/lib/depTrackingCache';

export function hasErrors(fieldsError: any) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

export function wait(time = 20) {
  return new Promise(r => setTimeout(r, time));
}

export function getDepCache(proxy: any): DepTrackingCache {
  return proxy && (proxy.data as DepTrackingCache);
}

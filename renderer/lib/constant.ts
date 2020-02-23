const HOST = 'localhost';
const PORT = '3003';

const ls = function(key: string) {
  if (typeof localStorage === 'undefined') {
    return '';
  }
  return localStorage.getItem(key);
};

export const DEVURLS = {
  SERVER_URL: `http://${HOST}:${PORT}`,
  WS_SERVER_URL: `ws://${HOST}:${PORT}`,
  GQL_URI: `http://${HOST}:${PORT}/graphql`,
  GQL_WS_URI: `ws://${HOST}:${PORT}/graphql`,
};

export const SERVER_URL =
  ls('SERVER_URL') || process.env.SERVER_URL || DEVURLS.SERVER_URL;
export const WS_SERVER_URL =
  ls('WS_SERVER_URL') || process.env.WS_SERVER_URL || DEVURLS.WS_SERVER_URL;
export const GQL_URI = ls('GQL_URI') || process.env.GQL_URI || DEVURLS.GQL_URI;
export const GQL_WS_URI =
  ls('GQL_WS_URI') || process.env.GQL_WS_URI || DEVURLS.GQL_WS_URI;

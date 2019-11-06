const HOST = 'localhost';
const PORT = '3003';

export const SERVER_URL = process.env.SERVER_URL || `http://${HOST}:${PORT}`;
export const WS_SERVER_URL =
  process.env.WS_SERVER_URL || `ws://${HOST}:${PORT}`;
export const GQL_URI = process.env.GQL_URI || `http://${HOST}:${PORT}/graphql`;
export const GQL_WS_URI =
  process.env.GQL_WS_URI || `http://${HOST}:${PORT}/graphql`;

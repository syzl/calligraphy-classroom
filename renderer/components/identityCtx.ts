import { createContext } from 'react';
const identity: { username?: string; token?: string } = {
  username: '',
  token: '',
};
const data = {
  identity,
  setIdentity: async (..._args: any[]) => {
    return null as any;
  },
};

export const IdentityContext = createContext(data);

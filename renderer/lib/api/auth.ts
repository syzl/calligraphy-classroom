import { v1, http } from './utils';

export const signUp = ({
  username,
  password,
  email,
}: {
  username: string;
  password: string;
  email?: string;
}) =>
  http(v1(`user/sign-up`), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  });

export const signIn = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) =>
  http(v1(`user/get-token`), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

import gql from 'graphql-tag';
import * as _ from 'lodash';

import { SignInReturn } from '../../interfaces';

export const signInParser = (data: any) => {
  console.log('signInParser', data);
  const signinUser: SignInReturn = _.get(data, 'signinUser');
  return signinUser;
};
export const SIGN_IN = gql`
  mutation Signin($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      accessToken
      expiresIn
    }
  }
`;
// WhoAmI
export const WHOAMI = gql`
  {
    auth_whoami {
      username
      id
      email
      isActive
    }
  }
`;

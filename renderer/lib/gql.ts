import gql from 'graphql-tag';
import * as _ from 'lodash';

import { SignInReturn } from '../interfaces';

export class GQLFragments {
  static base = gql`
    fragment base on BaseEntity {
      id
      createdAt
      updatedAt
    }
  `;
}

export class GQL {
  static signInParser = (data: any) => {
    console.log('signInParser', data);
    const signinUser: SignInReturn = _.get(data, 'signinUser');
    return signinUser;
  };
  static SIGN_IN = gql`
    mutation Signin($username: String!, $password: String!) {
      signinUser(username: $username, password: $password) {
        accessToken
        expiresIn
      }
    }
  `;
  // WhoAmI
  static WHOAMI = gql`
    {
      auth_whoami {
        username
        id
        email
        isActive
      }
    }
  `;
}

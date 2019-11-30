import ApolloClient from 'apollo-client';
import * as GQL from './gql';
import { WhoAmI } from '../interfaces';

export default (apolloClient: ApolloClient<any>) =>
  apolloClient
    .query<{ auth_whoami: WhoAmI }>({
      query: GQL.WHOAMI,
    })
    .then(({ data: { auth_whoami: whoami } }) => {
      return { whoami };
    })
    .catch(() => {
      // Fail gracefully
      return { whoami: {} as WhoAmI };
    });

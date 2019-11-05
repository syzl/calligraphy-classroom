import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { GQL } from './gql';
import { WhoAmI } from '../interfaces';

export default (apolloClient: ApolloClient<NormalizedCacheObject>) =>
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

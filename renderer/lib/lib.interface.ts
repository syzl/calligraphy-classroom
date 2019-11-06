import { ApolloClient } from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { NextPageContext } from 'next';

export interface MixedNextPageContext extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  apolloState: any;
}

import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { split, ApolloLink, RequestHandler } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from '@apollo/react-hooks';
import fetch from 'isomorphic-unfetch';
import { NextPage } from 'next';

import { GQL_URI, GQL_WS_URI } from './constant';
import { MixedNextPageContext } from './lib.interface';
import { getToken } from './utils';
import { auth } from './auth';

export const pureWithApollo = (PageComponent: FunctionComponent) => () => {
  const client = initApolloClient({}, { getToken });
  return (
    <ApolloProvider client={client}>
      <PageComponent />
    </ApolloProvider>
  );
};

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=true]
 */
export function withApollo(
  PageComponent: NextPage<any>,
  { ssr = true, needAuth = true } = {},
) {
  const WithApollo = ({
    apolloClient,
    apolloState,
    ...pageProps
  }: MixedNextPageContext) => {
    const client = apolloClient || initApolloClient(apolloState, { getToken });
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  if (process.env.NODE_ENV !== 'production') {
    // Find correct display name
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component';

    // Warn if old way of installing apollo is used
    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.');
    }

    // Set correct display name for devtools
    WithApollo.displayName = `withApollo(${displayName})`;

    // Add some prop types
    WithApollo.propTypes = {
      // Used for getDataFromTree rendering
      apolloClient: PropTypes.object,
      // Used for client/server rendering
      apolloState: PropTypes.object,
    };
  }
  WithApollo.getInitialProps = async (ctx: MixedNextPageContext) => {
    if (needAuth) {
      auth(ctx); // 统一 getToken 逻辑
    }
    const token = getToken(ctx.req);
    if (token) {
      if (typeof window === 'undefined') {
        console.info('get username from localstorage');
      } else {
        console.info('get username from db');
      }
    }
    const { AppTree } = ctx;
    // Run all GraphQL queries in the component tree
    // and extract the resulting data
    const apolloClient = (ctx.apolloClient = initApolloClient(
      {},
      {
        getToken: () => getToken(ctx.req),
      },
    ));

    const pageProps = {
      ...(PageComponent.getInitialProps
        ? await PageComponent.getInitialProps(ctx)
        : null),
    };

    // Only on the server
    if (typeof window === 'undefined') {
      // When redirecting, the response is finished.
      // No point in continuing to render
      if (ctx.res && ctx.res.finished) {
        return {};
      }

      if (ssr) {
        try {
          // Run all GraphQL queries
          const { getDataFromTree } = await import('@apollo/react-ssr');
          await getDataFromTree(
            <AppTree
              pageProps={{
                ...pageProps,
                apolloClient,
              }}
            />,
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error);
        }
      }

      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind();
    }

    // Extract query data from the Apollo store
    const apolloState = apolloClient.cache.extract();

    return {
      ...pageProps,
      apolloState,
    };
  };

  return WithApollo;
}

let apolloClient: ApolloClient<NormalizedCacheObject>;

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */
function initApolloClient(...args: [any, any]) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(...args);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(...args);
  }

  return apolloClient;
}

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 * @param  {Object} config
 */
function createApolloClient(
  initialState = {},
  { getToken }: { getToken: Function },
) {
  const fetchOptions: any = {};

  let link: ApolloLink | RequestHandler;

  const httpLink = new HttpLink({
    uri: GQL_URI, // Server URL (must be absolute)
    credentials: 'same-origin',
    fetch,
    fetchOptions,
  });

  link = httpLink;

  // If you are using a https_proxy, add fetchOptions with 'https-proxy-agent' agent instance
  // 'https-proxy-agent' is required here because it's a sever-side only module
  if (typeof window === 'undefined') {
    if (process.env.https_proxy) {
      fetchOptions.agent = new (require('https-proxy-agent'))(
        process.env.https_proxy,
      );
    }
  } else {
    // client-side only  Subscription
    const wsLink = new WebSocketLink({
      uri: GQL_WS_URI,
      options: {
        reconnect: true,
      },
    });
    link = split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    );
  }

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(link),
    cache: new InMemoryCache().restore(initialState),
  });
}

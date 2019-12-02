import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { ActionResult, MutateUpdatePayload } from '../../interfaces/gqlAction';
import { ApolloError, ApolloQueryResult } from 'apollo-client';
import { MutationFunctionOptions } from '@apollo/react-common';
import { ExecutionResult } from 'graphql';

interface WithProp<QueryKey extends string, SubscrbeKey> {
  id: number;
  queryKey: QueryKey;
  subscrbeKey?: SubscrbeKey;
  gqlDetail: any;
  gqlUpdate?: any;
  gqlSubscribe?: any;
}

interface ReturnCProp<T, QueryKey, UpdateKey> {
  detail: T;
  loading: boolean;
  error?: ApolloError;
  refetch: (
    variables?: Record<string, any> | undefined,
  ) => Promise<ApolloQueryResult<ActionResult<T, QueryKey>>>;
  updatePart: UpdateKey extends string
    ? (
        options?:
          | MutationFunctionOptions<
              ActionResult<T, UpdateKey>,
              MutateUpdatePayload<T, 'number'>
            >
          | undefined,
      ) => Promise<ExecutionResult<ActionResult<T, UpdateKey>>>
    : undefined;
}

export const withQueryDetail = function<
  T,
  QueryKey extends string,
  UpdateKey extends string | undefined = undefined,
  SubscrbeKey extends string | undefined = undefined
>(
  {
    id,
    queryKey,
    subscrbeKey = undefined,
    gqlDetail,
    gqlUpdate,
    gqlSubscribe,
  }: WithProp<QueryKey, SubscrbeKey>,
  DetailPageComponent: (
    prop: ReturnCProp<T, QueryKey, UpdateKey>,
  ) => JSX.Element,
) {
  const { loading, error, data, refetch } = useQuery<ActionResult<T, QueryKey>>(
    gqlDetail,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        id,
      },
    },
  );

  const detail = (data && data[queryKey]) || ({} as T);

  let updatePart: any;
  if (gqlUpdate) {
    [
      updatePart,
      //  { loading: updating, data: updated } 自动更新缓存
    ] = useMutation<ActionResult<T, UpdateKey>, MutateUpdatePayload<T>>(
      gqlUpdate,
    );
  }
  if (typeof subscrbeKey === 'string') {
    useSubscription(gqlSubscribe, {
      variables: { [subscrbeKey]: id },
    });
  }

  return (
    <DetailPageComponent
      {...{ id, detail, loading, error, refetch, updatePart }}
    />
  );
};

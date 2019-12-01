import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { ActionResult, MutateUpdatePayload } from '../../interfaces/gqlAction';
import { ApolloError, ApolloQueryResult } from 'apollo-client';
import { MutationFunctionOptions } from '@apollo/react-common';
import { ExecutionResult } from 'graphql';

interface WithProp<QueryKey extends string, SubscrbeKey extends string> {
  id: number;
  queryKey: QueryKey;
  subscrbeKey: SubscrbeKey;
  gqlDetail: any;
  gqlUpdate: any;
  gqlSubscribe: any;
}

interface ReturnCProp<T, QueryKey, UpdateKey> {
  detail: T;
  loading: boolean;
  error?: ApolloError;
  refetch: (
    variables?: Record<string, any> | undefined,
  ) => Promise<ApolloQueryResult<ActionResult<T, QueryKey>>>;
  updatePart: (
    options?:
      | MutationFunctionOptions<
          ActionResult<T, UpdateKey>,
          MutateUpdatePayload<T, 'number'>
        >
      | undefined,
  ) => Promise<ExecutionResult<ActionResult<T, UpdateKey>>>;
}

export const withQueryDetail = function<
  T,
  QueryKey extends string,
  UpdateKey extends string,
  SubscrbeKey extends string
>(
  {
    id,
    queryKey,
    subscrbeKey,
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

  const [
    updatePart,
    //  { loading: updating, data: updated } 自动更新缓存
  ] = useMutation<ActionResult<T, UpdateKey>, MutateUpdatePayload<T>>(
    gqlUpdate,
  );

  useSubscription(gqlSubscribe, {
    variables: { [subscrbeKey]: id },
  });

  return (
    <DetailPageComponent
      {...{ id, detail, loading, error, refetch, updatePart }}
    />
  );
};

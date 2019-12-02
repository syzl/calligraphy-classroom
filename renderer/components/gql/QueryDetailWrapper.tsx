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

interface WithPropR<T, QueryKey extends string, UpdateKey, SubscrbeKey>
  extends WithProp<QueryKey, SubscrbeKey> {
  render: (arg: ReturnCProp<T, QueryKey, UpdateKey>) => JSX.Element;
}

interface ReturnCProp<T, QueryKey, UpdateKey> {
  id: number;
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

const genParams = <T, QueryKey extends string, UpdateKey, SubscrbeKey>(
  prop: WithProp<QueryKey, SubscrbeKey>,
): ReturnCProp<T, QueryKey, UpdateKey> => {
  const {
    id,
    queryKey,
    subscrbeKey = undefined,
    gqlDetail,
    gqlUpdate,
    gqlSubscribe,
  } = prop;
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
  return { id, detail, loading, error, refetch, updatePart };
};

export const withQueryDetail = function<
  T,
  QueryKey extends string,
  UpdateKey extends string | undefined = undefined,
  SubscrbeKey extends string | undefined = undefined
>(
  props: WithProp<QueryKey, SubscrbeKey>,
  DetailPageComponent: (
    prop: ReturnCProp<T, QueryKey, UpdateKey>,
  ) => JSX.Element,
) {
  const params = genParams<T, QueryKey, UpdateKey, SubscrbeKey>(props);
  return <DetailPageComponent {...params} />;
};

/**
 * 使用 Graphql 显示数据列表, 传入 Query GQL
 * @param prop
 */
export const QueryDetailWrapper = function<
  T,
  QueryKey extends string,
  UpdateKey extends string | undefined = undefined,
  SubscrbeKey extends string | undefined = undefined
>(prop: WithPropR<T, QueryKey, UpdateKey, SubscrbeKey>) {
  const params = genParams<T, QueryKey, UpdateKey, SubscrbeKey>(prop);
  return <>{prop.render(params)}</>;
};

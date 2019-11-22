import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { PagedResult } from '../../interfaces';
import {
  ApolloQueryResult,
  UpdateQueryOptions,
  ApolloError,
} from 'apollo-client';
import { ExecutionResult } from 'graphql';
import { MutationFunctionOptions } from '@apollo/react-common';

// useQuery 会有 loading 和 error，还有空值

type WrapedPagedType<KeyT extends string, DataT> = {
  [key in KeyT]: PagedResult<DataT>;
};

type WrapedType<KeyT extends string, DataT> = {
  [key in KeyT]: DataT;
};

interface OriginProp<QueryDataT, WrapKey extends string> {
  loading: boolean;
  error?: ApolloError;
  refetch: (
    variables?: Record<string, any> | undefined,
  ) => Promise<ApolloQueryResult<WrapedPagedType<WrapKey, QueryDataT>>>;
  updateQuery: <TVars = Record<string, any>>(
    mapFn: (
      previousQueryResult: WrapedPagedType<WrapKey, QueryDataT>,
      options: UpdateQueryOptions<TVars>,
    ) => WrapedPagedType<WrapKey, QueryDataT>,
  ) => void;
}

interface renderNormalProp {
  loadMore: () => void;
  resetFetchMorePage: () => void;
  setFetchMorePage: React.Dispatch<any>;
  hasNext: string;
}

interface RenderProp<QueryDataT, WrapKey extends string>
  extends renderNormalProp {
  origin: OriginProp<QueryDataT, WrapKey>;
  dataItems: QueryDataT[];
}

interface RenderWithDelProp<
  QueryDataT,
  WrapKey extends string,
  DelWrapKey extends string
> extends RenderProp<QueryDataT, WrapKey> {
  delFn:
    | undefined
    | ((
        options?:
          | MutationFunctionOptions<
              WrapedType<DelWrapKey, QueryDataT>,
              Record<string, any>
            >
          | undefined,
      ) => Promise<ExecutionResult<WrapedType<DelWrapKey, QueryDataT>>>);
}

interface QueryBaseProp {
  gql: any;
  variables: {
    [key: string]: any;
  };
}

interface QueryListWrapperProp<QueryDataT, WrapKey extends string = 'data'>
  extends QueryBaseProp {
  dataKey: WrapKey;
  render: (val: RenderProp<QueryDataT, WrapKey>) => React.ReactNode;
}

interface QueryListWithDelWrapperProp<
  QueryDataT,
  WrapKey extends string = 'data',
  DelWrapKey extends string = 'delete'
> extends QueryListWrapperProp<QueryDataT, WrapKey> {
  deleteGql?: any;
  delDataKey?: DelWrapKey;
  render: (
    val: RenderWithDelProp<QueryDataT, WrapKey, DelWrapKey>,
  ) => React.ReactNode;
}

/**
 * 获取显示组件所需参数
 * @param param0
 */
export const genListParams = function<
  QueryDataT extends { id: number },
  WrapKey extends string = 'data'
>({ gql, variables, dataKey }: QueryListWrapperProp<QueryDataT, WrapKey>) {
  const initialPage = variables.page || 1;
  const [fetchMorePage, setFetchMorePage] = useState(initialPage);

  const {
    loading,
    error: queryError,
    data,
    refetch,
    fetchMore,
    updateQuery,
  } = useQuery<WrapedPagedType<WrapKey, QueryDataT>>(gql, {
    variables,
  });

  const { items: dataItems = [], next: hasNext } =
    (data && data[dataKey]) || ({} as PagedResult<QueryDataT>);

  const loadMore = function() {
    fetchMore({
      variables: {
        ...variables,
        page: fetchMorePage + 1,
      },
      updateQuery(prev, { fetchMoreResult }) {
        const olderItems = prev[dataKey];
        if (fetchMoreResult) {
          const pagedItems = fetchMoreResult[dataKey];
          return {
            [dataKey]: {
              ...pagedItems,
              items: [...olderItems.items, ...pagedItems.items],
            },
          } as WrapedPagedType<WrapKey, QueryDataT>;
        }
        return prev;
      },
    });
    setFetchMorePage(fetchMorePage + 1);
  };

  const resetFetchMorePage = () => setFetchMorePage(initialPage);

  return {
    origin: {
      loading,
      error: queryError,
      refetch,
      updateQuery,
    },
    loadMore,
    setFetchMorePage,
    resetFetchMorePage,
    dataItems,
    hasNext,
  };
};

/**
 * 使用 Graphql 显示数据列表, 传入 Query GQL
 * @param prop
 */
export const QueryListWrapper = function<
  QueryDataT extends { id: number },
  WrapKey extends string = 'data'
>(prop: QueryListWrapperProp<QueryDataT, WrapKey>) {
  const params = genListParams<QueryDataT, WrapKey>(prop);
  const comp = prop.render(params);
  return <>{comp}</>;
};

/**
 * 添加一个 delete 语句
 * @param prop
 */
export const genListWithDelParams = function<
  QueryDataT extends { id: number },
  WrapKey extends string = 'data',
  DelWrapKey extends string = 'data'
>(prop: QueryListWithDelWrapperProp<QueryDataT, WrapKey, DelWrapKey>) {
  const params = genListParams<QueryDataT, WrapKey>(prop);
  let mutationError: ApolloError | undefined;
  let delFn:
    | undefined
    | ((
        options?:
          | MutationFunctionOptions<
              WrapedType<DelWrapKey, QueryDataT>,
              Record<string, any>
            >
          | undefined,
      ) => Promise<ExecutionResult<WrapedType<DelWrapKey, QueryDataT>>>);
  const {
    origin: { updateQuery },
  } = params;
  const { deleteGql, delDataKey, dataKey } = prop;
  if (deleteGql && delDataKey) {
    [delFn, { error: mutationError }] = useMutation<
      WrapedType<DelWrapKey, QueryDataT>
    >(deleteGql, {
      update(proxy, { data }) {
        if (!data) {
          return proxy;
        }
        const deletedData = data[delDataKey];

        if (deletedData) {
          updateQuery(prev => {
            const prevData = prev[dataKey];

            const idx = prevData.items.findIndex(
              item => item.id === deletedData.id,
            );
            if (idx > -1) {
              prevData.items.splice(idx, 1);
              prevData.totalItems -= 1;
              return { ...prev, [dataKey]: prevData };
            }
            return prev;
          });
        }
      },
    });
  }
  return {
    ...params,
    delFn,
    origin: { ...params.origin, error: params.origin.error || mutationError },
  };
};

/**
 * 使用 Graphql 显示数据列表, 传入 Query GQL, Delete GQL
 * @param prop
 */
export const QueryListWithDelWrapper = function<
  QueryDataT extends { id: number },
  WrapKey extends string = 'data',
  DelWrapKey extends string = 'data'
>(prop: QueryListWithDelWrapperProp<QueryDataT, WrapKey, DelWrapKey>) {
  const params = genListWithDelParams<QueryDataT, WrapKey, DelWrapKey>(prop);
  const comp = prop.render(params);
  return <>{comp}</>;
};

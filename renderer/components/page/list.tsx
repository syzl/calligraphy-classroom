import { useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Card, Drawer, Alert } from 'antd';
import { holderCardProp } from '../../lib/common';

import { PagedResult } from '../../interfaces';
import InfiniteScroll from 'react-infinite-scroller';
import { ApolloQueryResult } from 'apollo-client';
import { DrawerProps } from 'antd/lib/drawer';

export interface Initvars {
  limit: number;
  page: number;
}

interface QueryVarProp<VarT> {
  query: any;
  vars: VarT;
}

interface PageProp<VarT, ItemT> {
  title?: string;
  datalist: QueryVarProp<VarT>;
  enableFetchmore?: boolean;
  extra?: ({
    setFetchMorePage,
    refetch,
    setShowDrawer,
  }: {
    setFetchMorePage: Dispatch<SetStateAction<number>>;
    refetch: (
      variables?: Record<string, any> | undefined,
    ) => Promise<
      ApolloQueryResult<{
        pagedItems: PagedResult<ItemT>;
      }>
    >;
    setShowDrawer: Dispatch<SetStateAction<boolean>>;
  }) => ReactNode;
  renderList: (dataItems: ItemT[], ...args: any[]) => ReactNode;
  drawerProps?: DrawerProps;
}

// 功能点：
// - List Data
// - Data mutation, Create, Update, Delete
// - Data Query, Filter
// - Data Relation

export const EntityListPage = function<VarT, ItemT>({
  title,
  datalist,
  enableFetchmore = false,
  extra,
  renderList,
  drawerProps,
}: PageProp<VarT, ItemT>) {
  const initialPage = 1;
  const [fetchMorePage, setFetchMorePage] = useState(initialPage);
  const [showDrawer, setShowDrawer] = useState(false);

  const {
    loading,
    error: queryError,
    data,
    refetch,
    fetchMore,
    updateQuery,
  } = useQuery<{ pagedItems: PagedResult<ItemT> }>(datalist.query, {
    notifyOnNetworkStatusChange: true,
    variables: {
      ...datalist.vars,
    },
  });

  let loadMore: Function;
  if (enableFetchmore) {
    loadMore = function() {
      return fetchMore({
        variables: {
          ...datalist.vars,
          page: fetchMorePage + 1,
        },
        updateQuery(prev, { fetchMoreResult }) {
          const { pagedItems: olderItems } = prev;
          if (fetchMoreResult) {
            const { pagedItems } = fetchMoreResult;
            return {
              pagedItems: {
                ...pagedItems,
                items: [...olderItems.items, ...pagedItems.items],
              },
            };
          }
          return prev;
        },
      });
    };
  }

  const { items: dataItems, next } =
    (data && data.pagedItems) || ({} as PagedResult<ItemT>);
  let extraComponent: ReactNode;
  if (extra) {
    extraComponent = extra({ setFetchMorePage, refetch, setShowDrawer });
  }
  const mainContent = renderList(dataItems, updateQuery);
  return (
    <Card {...holderCardProp} title={title} extra={extraComponent}>
      {queryError && <Alert type="error" message={queryError.message} />}
      <InfiniteScroll
        initialLoad={true}
        loadMore={() => {
          loadMore();
        }}
        hasMore={!!next && !loading}
        useWindow={false}
      >
        {mainContent}
      </InfiniteScroll>

      <Drawer
        width="360"
        placement="right"
        closable={false}
        onClose={() => {
          setShowDrawer(false);
        }}
        visible={showDrawer}
        {...drawerProps}
      ></Drawer>
    </Card>
  );
};

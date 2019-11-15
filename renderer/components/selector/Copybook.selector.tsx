import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { COURSE_COPYBOOKS } from '../../lib/gql';
import { Alert, List, Avatar, Button } from 'antd';
import { CursorResult, Copybook } from '../../interfaces';
import { SERVER_URL } from '../../lib/constant';
import InfiniteScroll from 'react-infinite-scroller';
import IconWithLoading from '../IconWithLoading';

export default function CopybookSelector({
  onSelect,
  by,
}: {
  onSelect?: (id: number, belongId: number) => unknown;
  by?: number;
}) {
  const { error, loading, data, fetchMore, refetch } = useQuery<{
    copybooks: CursorResult<Copybook>;
  }>(COURSE_COPYBOOKS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      cursor: {
        first: 10,
        after: undefined,
      },
      by,
    },
  });
  const { copybooks } = data || {};
  const {
    edges = [],
    pageInfo,
    // totalCount,
  } = copybooks || ({} as CursorResult<Copybook>);

  const loadMore = () => {
    fetchMore({
      variables: {
        first: 10,
        after: pageInfo.endCursor,
      },
      updateQuery(prev, { fetchMoreResult }) {
        console.info(prev, fetchMoreResult, '~~~');
        return prev;
      },
    });
  };
  return error ? (
    <Alert message={error.message} type="error" />
  ) : !copybooks ? null : (
    <div>
      <InfiniteScroll
        initialLoad={false}
        loadMore={loadMore}
        hasMore={!loading && pageInfo.hasNextPage}
        useWindow={false}
      >
        <List
          header={<IconWithLoading type="reload" onClick={() => refetch()} />}
          loading={loading}
          dataSource={edges}
          renderItem={({ node, cursor }) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => {
                    onSelect &&
                      by &&
                      onSelect(node.id, !node.demon_video ? by : -1);
                  }}
                >
                  {!node.demon_video ? '关联' : '取消关联'}
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  node.raw ? (
                    <Avatar
                      shape="square"
                      size={56}
                      src={`${SERVER_URL}/${node.raw.path.replace(
                        /^_static\//,
                        '',
                      )}`}
                    />
                  ) : null
                }
                description={cursor}
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
}

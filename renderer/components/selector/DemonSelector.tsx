import React from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import InfiniteScroll from 'react-infinite-scroller';
import { Alert, Button, List } from 'antd';

import { PagedResult, Demonstrate } from '../../interfaces';
import { API_DEMONSTRATES, S_DEMON__C_RELATION } from '../../lib/gql';
import IconWithLoading from '../IconWithLoading';

interface Props {
  by?: number | string;
  showRelated?: boolean;
  onSelected?: (id: string | number) => void;
}
export default function DemonSelector({
  by = -1,
  showRelated = false,
  onSelected,
}: Props) {
  const { data, loading, error, fetchMore, refetch, updateQuery } = useQuery<{
    api_demonstrates: PagedResult<Demonstrate>;
  }>(API_DEMONSTRATES, {
    notifyOnNetworkStatusChange: true,
    variables: { page: 1, limit: 10, by },
  });

  const { items = [] as Demonstrate[], next } =
    (data && data.api_demonstrates) || ({} as PagedResult<Demonstrate>);

  const {
    data: { relation: mutated } = {} as { relation: Demonstrate },
  } = useSubscription<{
    relation: Demonstrate;
  }>(S_DEMON__C_RELATION);

  console.info('pr', mutated, 'mutated');
  if (mutated) {
    updateQuery(prev => {
      if (!prev) {
        refetch();
        return prev;
      }
      console.info('api_demonstrates', prev, 'prev');
      let {
        api_demonstrates: { items: [...newItems] = [] as any } = {} as any,
      } = prev;
      const targetIdx = newItems.findIndex(
        (item: any) => item.id === mutated.id,
      );
      console.info('targetIdx', targetIdx, mutated);
      if (targetIdx > -1) {
        newItems[targetIdx] = { ...newItems[targetIdx], ...mutated };

        return {
          api_demonstrates: { ...prev.api_demonstrates, items: newItems },
        };
      }

      return prev;
    });
  }

  return error ? (
    <Alert message={error.message} type="error" />
  ) : (
    <InfiniteScroll
      initialLoad={false}
      pageStart={0}
      loadMore={() => {
        fetchMore({
          variables: {
            page: Math.floor(items.length / 10) + 1,
          },
          updateQuery(prev, { fetchMoreResult }) {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, prev, {
              api_upload_raws: {
                ...fetchMoreResult.api_demonstrates,
                items: [
                  ...prev.api_demonstrates.items,
                  ...fetchMoreResult.api_demonstrates.items,
                ],
              },
            });
          },
        });
      }}
      hasMore={!loading && !!next}
      useWindow={false}
    >
      <List
        footer={
          <div>
            <IconWithLoading type="reload" onClick={() => refetch()} />
          </div>
        }
        bordered
        dataSource={showRelated ? items : items.filter(item => !item.course)}
        renderItem={item => (
          <List.Item
            actions={[
              <Button
                type="link"
                icon="interaction"
                onClick={() => {
                  // console.info(item, 'selct');
                  onSelected && onSelected(item.id);
                }}
              >
                关联
              </Button>,
            ]}
          >
            <List.Item.Meta
              //   avatar={<Typography.Text mark>{item.type}</Typography.Text>}
              title={item.title}
            />
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
}

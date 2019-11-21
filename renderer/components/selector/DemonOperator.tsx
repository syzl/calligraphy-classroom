import React from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
// import InfiniteScroll from 'react-infinite-scroller';
import {
  Alert,
  Button,
  List,
  Row,
  Col,
  Typography,
  Divider,
  Tooltip,
  Icon,
} from 'antd';

import { PagedResult, Demonstrate } from '../../interfaces';
import { API_DEMONSTRATES, S_DEMON__C_RELATION } from '../../lib/gql';
import IconWithLoading from '../IconWithLoading';

interface Props {
  by?: number | string;
  onSelected?: (id: string | number) => void;
}
export default function DemonSelector({ by = -1, onSelected }: Props) {
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

  if (mutated) {
    updateQuery(prev => {
      if (!prev) {
        refetch();
        return prev;
      }
      let {
        api_demonstrates: { items: [...newItems] = [] as any } = {} as any,
      } = prev;
      const targetIdx = newItems.findIndex(
        (item: any) => item.id === mutated.id,
      );
      if (targetIdx === -1) {
        // 未找到，刷新items
        newItems.unshift(mutated);
        refetch();
      }
      // else 已存在的，将自动更新缓存

      return prev;
    });
  }

  const loadMore = () => {
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
  };

  const c = items.filter(item => item.course && item.course.id !== by); // 缓存中与当前关联 course 不一致的数据

  return error ? (
    <Alert message={error.message} type="error" />
  ) : (
    <List
      loading={loading}
      bordered
      dataSource={items}
      header={
        <Row type="flex">
          <Col style={{ flex: 1 }}>
            <Typography.Text strong>可选关联</Typography.Text>
          </Col>
          <Col>
            {c.length ? (
              <>
                <Tooltip title={<div>操作期间一些内容被其他课程关联</div>}>
                  <Icon type="info-circle" />
                </Tooltip>
                <Divider type="vertical" />
              </>
            ) : null}
            <IconWithLoading type="reload" onClick={() => refetch()} />
          </Col>
        </Row>
      }
      footer={
        <Button
          title="加载更多"
          block
          type="link"
          icon="small-dash"
          onClick={() => loadMore()}
          disabled={!next}
        />
      }
      renderItem={item => (
        <List.Item
          actions={
            item.course
              ? [
                  <Button type="link" disabled={true}>
                    已关联
                  </Button>,
                ]
              : [
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
                ]
          }
        >
          <List.Item.Meta
            title={
              <span>
                <Typography.Text type="secondary" mark>
                  {item.id}
                </Typography.Text>{' '}
                <Typography.Text>{item.title}</Typography.Text>
              </span>
            }
          />
        </List.Item>
      )}
    />
  );
}

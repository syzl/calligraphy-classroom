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
import Link from 'next/link';
import { relateCourse } from '../../lib/api';

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
  const [a, b, c] = items.reduce(
    (result, item) => {
      if (!item.course) {
        result[0].push(item);
      } else if (item.course.id === by) {
        result[1].push(item);
      } else {
        result[2].push(item);
      }
      return result;
    },
    [[], [], []] as Demonstrate[][],
  );
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
  return error ? (
    <Alert message={error.message} type="error" />
  ) : (
    <Row type="flex" gutter={10}>
      <Col style={{ flex: 1 }}>
        <List
          loading={loading}
          bordered
          dataSource={b}
          header={
            <Row type="flex">
              <Col style={{ flex: 1 }}>
                <Typography.Text strong>关联的范字演示</Typography.Text>
              </Col>
              <Col></Col>
            </Row>
          }
          renderItem={item => (
            <List.Item
              actions={[
                <Link
                  href="/dashboard/demonstrate/[id]"
                  as={`/dashboard/demonstrate/${item.id}`}
                >
                  <a>详情</a>
                </Link>,
                <Button
                  type="link"
                  icon="disconnect"
                  onClick={() => {
                    relateCourse(item.id, -1);
                  }}
                />,
              ]}
            >
              <List.Item.Meta title={item.title} description={item.desc} />
            </List.Item>
          )}
        ></List>
      </Col>
      <Col style={{ flex: 1 }}>
        <List
          loading={loading}
          bordered
          dataSource={a}
          header={
            <Row type="flex">
              <Col style={{ flex: 1 }}>
                <Typography.Text strong>未关联的范字演示</Typography.Text>
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
              <List.Item.Meta title={item.title} />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
}

import React, { useState } from 'react';
import {
  Button,
  message,
  Icon,
  Divider,
  Drawer,
  Row,
  Col,
  Popover,
  List,
  Avatar,
  Spin,
  Card,
} from 'antd';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as _ from 'lodash';
import { withApollo } from '../../../lib/apollo';
import * as GQL from '../../../lib/gql';
import { wait, getDepCache } from '../../../lib/utils';
import { Demonstrate, PagedResult } from '../../../interfaces';
import CreateDemonstrate from '../../../components/forms/Demonstrate';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroller';
import { holderCardProp } from '../../../lib/common';

const limit = 10;

const Demonstrates: NextPage = function() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [page, setPage] = useState(1);
  const { push } = useRouter();
  const [refetching, setRefetching] = useState(false);
  const { loading, error, data, refetch, updateQuery, fetchMore } = useQuery<{
    api_demonstrates: PagedResult<Demonstrate>;
  }>(GQL.API_DEMONSTRATES, {
    variables: {
      limit,
      page: 1,
    },
  });
  const refetchWithMarking = async () => {
    if (refetching) return;
    setRefetching(true);
    await Promise.all([wait(1000), refetch()]);
    setRefetching(false);
  };
  const [deleteDemonstrate, { loading: deleting }] = useMutation<{
    deleteDemonstrate: Demonstrate;
  }>(GQL.DELETE_DEMONSTRATE, {
    update(proxy, { data }) {
      if (!data) {
        return proxy;
      }
      const { deleteDemonstrate } = data;
      if (deleteDemonstrate) {
        // 优化内存占用, 效果不大, 无法撤销
        const cache = getDepCache(proxy);
        cache.delete(`Demonstrate：${deleteDemonstrate.id}`);
        updateQuery(prev => {
          const {
            api_demonstrates: { ...api_demonstrates },
          } = prev;
          const idx = api_demonstrates.items.findIndex(
            item => item.id === deleteDemonstrate.id,
          );
          if (idx > -1) {
            api_demonstrates.items.splice(idx, 1);
            api_demonstrates.totalItems -= 1;
            return { ...prev, api_demonstrates };
          }
          return prev;
        });
      }
    },
  });

  if (error) {
    message.error(error.message);
  }
  const { items: demonstrates, next } =
    (data && data.api_demonstrates) || ({} as PagedResult<Demonstrate>);

  const loadMore = function() {
    fetchMore({
      variables: { page: page + 1, limit },
      updateQuery(prev, { fetchMoreResult }) {
        const { api_demonstrates: older } = prev;
        if (fetchMoreResult) {
          const { api_demonstrates } = fetchMoreResult;
          return {
            api_demonstrates: {
              ...api_demonstrates,
              items: [...older.items, ...api_demonstrates.items],
            },
          };
        } else {
          return prev;
        }
      },
    });
    setPage(page + 1);
  };
  return (
    <Card
      {...holderCardProp}
      title="课程环节"
      extra={
        <Row type="flex" style={{ flex: '0 0 auto' }}>
          <Col style={{ flex: 1 }}></Col>
          <Col>
            <Icon
              style={{ padding: 5 }}
              type="reload"
              spin={refetching}
              onClick={refetchWithMarking}
            />
            <Divider type="vertical" />
            <Button
              icon="plus"
              type="primary"
              shape="circle"
              onClick={() => setShowDrawer(true)}
            />
          </Col>
        </Row>
      }
    >
      <div style={{ flex: 1, overflow: 'auto' }}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={loadMore}
          hasMore={!(loading || refetching) && !!next}
          useWindow={false}
        >
          <List
            dataSource={demonstrates}
            renderItem={item => (
              <List.Item
                key={item.id}
                actions={[
                  <Button
                    type="link"
                    onClick={() =>
                      push(
                        '/dashboard/demonstrate/[id]',
                        `/dashboard/demonstrate/${item.id}`,
                      )
                    }
                  >
                    编辑
                  </Button>,
                  <Popover
                    trigger="click"
                    placement="left"
                    content={
                      <Button
                        type="danger"
                        icon="delete"
                        loading={deleting}
                        onClick={() => {
                          return deleteDemonstrate({
                            variables: { id: item.id },
                          });
                        }}
                      >
                        确定删除
                      </Button>
                    }
                  >
                    <Icon type="delete" />
                  </Popover>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar>{item.id}</Avatar>}
                  title={
                    <Link
                      href="/dashboard/demonstrate/[id]"
                      as={`/dashboard/demonstrate/${item.id}`}
                    >
                      <a>{item.title}</a>
                    </Link>
                  }
                  description={item.desc}
                />
                <div>
                  type:{item.type} subType:{item.subType}
                </div>
              </List.Item>
            )}
          >
            {loading && !!next && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
      <Drawer
        width="360"
        title="范字演示"
        placement="right"
        closable={false}
        onClose={() => {
          setShowDrawer(false);
        }}
        visible={showDrawer}
      >
        <CreateDemonstrate
          onCompleted={() => {
            refetchWithMarking();
          }}
        />
      </Drawer>
    </Card>
  );
};
export default withApollo(Demonstrates);

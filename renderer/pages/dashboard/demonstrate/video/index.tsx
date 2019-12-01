import React, { useState } from 'react';
import {
  Button,
  List,
  Avatar,
  Divider,
  Card,
  Row,
  Col,
  Alert,
  Popover,
  Icon,
  Spin,
  Drawer,
} from 'antd';
import {
  API_DEMON_VIDEOS,
  DELETE_DEMONSTRATE_VIDEO,
} from '../../../../lib/gql';
import { Button_ } from '../../../../components/LoadingWrapper';
import { DemonstrateVideo } from '../../../../interfaces';
import Link from 'next/link';
import { withApollo } from '../../../../lib/apollo';
import { useRouter } from 'next/router';
import { QueryListWithDelWrapper } from '../../../../components/gql/QueryListWrapper';
import { holderCardProp } from '../../../../lib/common';
import IconWithLoading from '../../../../components/IconWithLoading';
import InfiniteScroll from 'react-infinite-scroller';

// API_DEMON_VIDEOS

export default withApollo(function DemonVideoList() {
  const [showDrawer, setShowDrawer] = useState(false);
  const { push } = useRouter();

  return (
    <QueryListWithDelWrapper<
      DemonstrateVideo,
      'pagedItems',
      'deleteDemonstrateVideo'
    >
      gql={API_DEMON_VIDEOS}
      deleteGql={DELETE_DEMONSTRATE_VIDEO}
      dataKey="pagedItems"
      delDataKey="deleteDemonstrateVideo"
      variables={{ limit: 8, page: 1 }}
      render={({
        origin: { loading, error, refetch },
        hasNext,
        dataItems,
        setFetchMorePage,
        loadMore,
        delFn: deleteCourse,
      }) => {
        return (
          <Card
            {...holderCardProp}
            title="临摹视频"
            extra={
              <Row type="flex">
                <Col style={{ flex: 1 }}></Col>
                <Col style={{ paddingTop: 5 }}></Col>
                <Col>
                  <IconWithLoading
                    style={{ padding: 5 }}
                    type="reload"
                    onClick={() => {
                      setFetchMorePage(1);
                      refetch();
                    }}
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
            {error ? <Alert type="error" message={error.message} /> : null}
            <div style={{ flex: '1 1 400px', overflow: 'auto' }}>
              <InfiniteScroll
                initialLoad={true}
                loadMore={() => loadMore()}
                hasMore={!!hasNext && !loading}
                useWindow={false}
              >
                <List
                  dataSource={dataItems}
                  renderItem={item => (
                    <List.Item
                      key={item.id}
                      actions={[
                        <Button
                          type="link"
                          onClick={() => {
                            push(
                              '/dashboard/demonstrate/video/[id]',
                              `/dashboard/demonstrate/video/${item.id}`,
                            );
                          }}
                        >
                          详情
                        </Button>,
                        deleteCourse ? (
                          <Popover
                            trigger="click"
                            placement="left"
                            content={
                              <Button_
                                type="danger"
                                icon="delete"
                                onClick={() =>
                                  deleteCourse({ variables: { id: item.id } })
                                }
                              >
                                确定删除
                              </Button_>
                            }
                          >
                            <Icon type="delete" />
                          </Popover>
                        ) : null,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Link
                            href="/dashboard/demonstrate/video/[id]"
                            as={`/dashboard/demonstrate/video/${item.id}`}
                          >
                            <Avatar style={{ cursor: 'pointer' }} size={48}>
                              {item.id}
                            </Avatar>
                          </Link>
                        }
                        title={
                          <Link
                            href="/dashboard/demonstrate/video/[id]"
                            as={`/dashboard/demonstrate/video/${item.id}`}
                          >
                            <a>{item.duration}</a>
                          </Link>
                        }
                        description={item.createdAt}
                      />
                    </List.Item>
                  )}
                >
                  {loading && !!hasNext && (
                    <div className="demo-loading-container">
                      <Spin />
                    </div>
                  )}
                </List>
              </InfiniteScroll>
            </div>
            <Drawer
              width="360"
              title="临摹视频"
              placement="right"
              closable={false}
              onClose={() => {
                setShowDrawer(false);
              }}
              visible={showDrawer}
            ></Drawer>
          </Card>
        );
      }}
    />
  );
});

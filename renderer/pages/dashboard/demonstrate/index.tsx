import React, { useState } from 'react';
import {
  Button,
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
  Alert,
  Typography,
} from 'antd';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import * as _ from 'lodash';
import { withApollo } from '../../../lib/apollo';

import { Demonstrate } from '../../../interfaces';
import CreateDemonstrate from '../../../components/forms/Demonstrate';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroller';
import { holderCardProp } from '../../../lib/common';
import { QueryListWithDelWrapper } from '../../../components/gql/QueryListWrapper';
import { API_DEMONSTRATES, DELETE_DEMONSTRATE } from '../../../lib/gql';
import IconWithLoading from '../../../components/IconWithLoading';
import { Button_ } from '../../../components/LoadingWrapper';

const Demonstrates: NextPage = function() {
  const [showDrawer, setShowDrawer] = useState(false);
  const { push } = useRouter();

  return (
    <QueryListWithDelWrapper<
      Demonstrate,
      'api_demonstrates',
      'deleteDemonstrate'
    >
      gql={API_DEMONSTRATES}
      deleteGql={DELETE_DEMONSTRATE}
      dataKey="api_demonstrates"
      delDataKey="deleteDemonstrate"
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
            title={
              <>
                <Typography.Title level={4}>课程环节 </Typography.Title>
                <Typography.Text type="secondary">
                  每个课程环节包含多个临摹视频
                </Typography.Text>
              </>
            }
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
                              '/dashboard/demonstrate/[id]',
                              `/dashboard/demonstrate/${item.id}`,
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
                            href="/dashboard/demonstrate/[id]"
                            as={`/dashboard/demonstrate/${item.id}`}
                          >
                            <Avatar style={{ cursor: 'pointer' }} size={48}>
                              {item.id}
                            </Avatar>
                          </Link>
                        }
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
              title="课程环节"
              placement="right"
              closable={false}
              onClose={() => {
                setShowDrawer(false);
              }}
              visible={showDrawer}
            >
              <CreateDemonstrate
                onCompleted={() => {
                  refetch();
                }}
              />
            </Drawer>
          </Card>
        );
      }}
    />
  );
};
export default withApollo(Demonstrates);

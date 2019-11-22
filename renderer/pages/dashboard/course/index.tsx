import React, { useState } from 'react';
import {
  Button,
  Alert,
  Icon,
  Divider,
  Drawer,
  Row,
  Col,
  Tag,
  List,
  Avatar,
  Spin,
  Popover,
  Card,
} from 'antd';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import * as _ from 'lodash';
import { withApollo } from '../../../lib/apollo';

import { Course } from '../../../interfaces';
import CreateCourse from '../../../components/forms/Course';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroller';
import IconWithLoading from '../../../components/IconWithLoading';
import { holderCardProp } from '../../../lib/common';
import { API_COURSES, DELETE_COURSE } from '../../../lib/gql';
import { QueryListWrapper } from '../../../components/gql/QueryWrapper';
import { Button__ } from '../../../components/LoadingWrapper';

const Courses: NextPage = function() {
  const [showDrawer, setShowDrawer] = useState(false);
  const { push } = useRouter();

  return (
    <QueryListWrapper<Course, 'api_courses', 'deleteCourse'>
      gql={API_COURSES}
      deleteGql={DELETE_COURSE}
      dataKey="api_courses"
      delDataKey="deleteCourse"
      variables={{ limit: 10, page: 1 }}
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
            title="课程"
            extra={
              <Row type="flex">
                <Col style={{ flex: 1 }}></Col>
                <Col style={{ paddingTop: 5 }}>
                  {['硬笔', '毛笔', '义务教育', '自选'].map(type => (
                    <Tag color="#2db7f5" key={type}>
                      {type}
                    </Tag>
                  ))}
                </Col>
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
                loadMore={() => {
                  loadMore();
                }}
                hasMore={!!hasNext && !loading}
                // && !refetching}
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
                              '/dashboard/course/[id]',
                              `/dashboard/course/${item.id}`,
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
                              <Button__
                                type="danger"
                                icon="delete"
                                onClick={() =>
                                  deleteCourse({ variables: { id: item.id } })
                                }
                              >
                                确定删除
                              </Button__>
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
                            href="/dashboard/course/[id]"
                            as={`/dashboard/course/${item.id}`}
                          >
                            <Avatar style={{ cursor: 'pointer' }} size={48}>
                              {item.id}
                            </Avatar>
                          </Link>
                        }
                        title={
                          <Link
                            href="/dashboard/course/[id]"
                            as={`/dashboard/course/${item.id}`}
                          >
                            <a>{item.name}</a>
                          </Link>
                        }
                        description={item.createdAt}
                      />
                      <div>{item.teacher}</div>
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
              title="课程"
              placement="right"
              closable={false}
              onClose={() => {
                setShowDrawer(false);
              }}
              visible={showDrawer}
            >
              <CreateCourse
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

export default withApollo(Courses);

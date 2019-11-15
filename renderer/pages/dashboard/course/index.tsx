import React, { useState } from 'react';
import {
  Button,
  message,
  Icon,
  Divider,
  Drawer,
  Row,
  Col,
  Typography,
  Tag,
  List,
  Avatar,
  Spin,
  Popover,
} from 'antd';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as _ from 'lodash';
import { withApollo } from '../../../lib/apollo';
import * as GQL from '../../../lib/gql';
import { wait, getDepCache } from '../../../lib/utils';
import { Course, PagedResult } from '../../../interfaces';
import CreateCourse from '../../../components/forms/Course';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroller';
import IconWithLoading from '../../../components/IconWithLoading';

const limit = 10;

const Courses: NextPage = function() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const { push } = useRouter();
  const { loading, error, data, refetch, fetchMore, updateQuery } = useQuery<{
    api_courses: PagedResult<Course>;
  }>(GQL.API_COURSES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      limit,
      page: 1,
    },
  });

  const [deleteCourse, { loading: deleting }] = useMutation<{
    deleteCourse: Course;
  }>(GQL.DELETE_COURSE, {
    update(proxy, { data }) {
      if (!data) {
        return proxy;
      }
      const { deleteCourse } = data;
      if (deleteCourse) {
        // 优化内存占用, 效果不大, 无法撤销
        const cache = getDepCache(proxy);
        cache.delete(`Course：${deleteCourse.id}`);
        updateQuery(prev => {
          const {
            api_courses: { ...api_courses },
          } = prev;
          const idx = api_courses.items.findIndex(
            item => item.id === deleteCourse.id,
          );
          if (idx > -1) {
            api_courses.items.splice(idx, 1);
            api_courses.totalItems -= 1;
            return { ...prev, api_courses };
          }
          return prev;
        });
      }
    },
  });

  if (error) {
    message.error(error.message);
  }
  const { items: courses, next } =
    (data && data.api_courses) || ({} as PagedResult<Course>);

  const refetchWithMarking = async () => {
    if (refetching) return;
    setRefetching(true);

    await Promise.all([
      wait(1000),
      fetchMore({
        variables: { page: pageNum + 1, limit },
        updateQuery(prev, { fetchMoreResult }) {
          const { api_courses: older } = prev;
          if (fetchMoreResult) {
            const { api_courses } = fetchMoreResult;
            return {
              api_courses: {
                ...api_courses,
                items: [...older.items, ...api_courses.items],
              },
            };
          } else {
            return prev;
          }
        },
      }),
    ]);
    setPageNum(pageNum + 1);
    setRefetching(false);
  };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row type="flex" style={{ flex: '0 0 auto' }}>
        <Col style={{ flex: 1 }}>
          <Typography.Title level={3}>课程</Typography.Title>
        </Col>
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
            onClick={() => refetchWithMarking()}
          />
          <Divider type="vertical" />
          <IconWithLoading
            style={{ padding: 5 }}
            type="reload"
            onClick={() => {
              setPageNum(1);
              refetch();
            }}
          />
          <Divider type="vertical" />
          <Button
            shape="round"
            onClick={() => {
              push('/dashboard/course/add');
            }}
          >
            添加
          </Button>
          <Divider type="vertical" />
          <Button
            icon="plus"
            type="primary"
            shape="circle"
            onClick={() => setShowDrawer(true)}
          />
        </Col>
      </Row>
      <div style={{ flex: '1 1 400px', overflow: 'auto' }}>
        <InfiniteScroll
          initialLoad={true}
          loadMore={() => {
            refetchWithMarking();
          }}
          hasMore={!!next && !loading}
          // && !refetching}
          useWindow={false}
        >
          <List
            dataSource={courses || []}
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
                  <Popover
                    trigger="click"
                    placement="left"
                    content={
                      <Button
                        type="danger"
                        icon="delete"
                        loading={deleting}
                        onClick={() => {
                          deleteCourse({ variables: { id: item.id } });
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
                  avatar={<Avatar size={48}>{item.id}</Avatar>}
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
            refetchWithMarking();
          }}
        />
      </Drawer>
    </div>
  );
};
export default withApollo(Courses);

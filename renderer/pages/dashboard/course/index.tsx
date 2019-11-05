import React, { useState } from 'react';
import {
  Button,
  message,
  Icon,
  Divider,
  Table,
  Drawer,
  Row,
  Col,
  Typography,
  Tooltip,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as _ from 'lodash';
import { withApollo } from '../../../lib/apollo';
import * as GQL from '../../../lib/gql';
import { wait, getDepCache } from '../../../lib/utils';
import { Course, PagedResult } from '../../../interfaces';
import CreateCourse from '../../../components/forms/Course';

const Courses: NextPage = function() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { push } = useRouter();
  const [refetching, setRefetching] = useState(false);
  const { loading, error, data, refetch, updateQuery } = useQuery<{
    api_courses: PagedResult<Course>;
  }>(GQL.API_COURSES, {
    variables: {
      limit,
      page,
    },
  });
  const refetchWithMarking = async () => {
    if (refetching) return;
    setRefetching(true);
    await Promise.all([wait(1000), refetch()]);
    setRefetching(false);
  };
  const [deleteCourse, { loading: deleting }] = useMutation<{
    deleteCourse: Course | null;
  }>(GQL.DELETE_COURSE, {
    update(proxy, { data: { deleteCourse } }) {
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

  const columns: ColumnProps<Course>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '讲师',
      dataIndex: 'teacher',
      key: 'teacher',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_: any, record: any) => (
        <span>
          <Button type="link">进入课堂</Button>
          <Divider type="vertical" />
          <Tooltip
            trigger="click"
            placement="left"
            title={
              <Button
                type="danger"
                icon="delete"
                loading={deleting}
                onClick={() => {
                  deleteCourse({ variables: { id: record.id } });
                }}
              >
                确定删除
              </Button>
            }
          >
            <Icon type="delete" />
          </Tooltip>
        </span>
      ),
    },
  ];

  if (error) {
    message.error(error.message);
  }
  const { items: courses, totalItems } =
    (data && data.api_courses) || ({} as PagedResult<Course>);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row type="flex" style={{ flex: '0 0 auto' }}>
        <Col style={{ flex: 1 }}>
          <Typography.Title level={3}>课程</Typography.Title>
        </Col>
        <Col>
          <Icon
            style={{ padding: 5 }}
            type="reload"
            spin={refetching}
            onClick={refetchWithMarking}
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
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          size="small"
          loading={loading || refetching}
          rowKey="id"
          columns={columns}
          dataSource={courses}
          // scroll={{ y: 360 }}
          pagination={{
            size: 'small',
            total: totalItems,
            pageSize: limit,
            current: page,
            showSizeChanger: true,
            pageSizeOptions: ['6', '10', '30', '50'],
            onChange(page, pageSize) {
              setPage(page);
              pageSize && setLimit(pageSize);
            },
            onShowSizeChange(current, size) {
              setPage(current);
              setLimit(size);
            },
          }}
        />
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
export default withApollo(Courses, { ssr: false });

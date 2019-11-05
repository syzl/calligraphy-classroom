import React, { useState } from 'react';
import { Card, Button, message, Icon, Divider, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as _ from 'lodash';
import { withApollo } from '../../../lib/apollo';
import { GQL } from '../../../lib/gql';
import { wait, getDepCache } from '../../../lib/utils';
import { Course, PagedResult } from '../../../interfaces';

const Courses: NextPage = function() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { push } = useRouter();
  const [refetching, setRefetching] = useState(false);
  const { loading, error, data, refetch, updateQuery } = useQuery<{
    api_courses: PagedResult<Course>;
  }>(GQL.API_COURCES, {
    variables: {
      limit,
      page,
    },
  });
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
          <Button
            type="link"
            icon="delete"
            loading={deleting}
            onClick={() => {
              deleteCourse({ variables: { id: record.id } });
            }}
          />
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
    <div style={{ height: '100%', display: 'flex' }}>
      <Card
        loading={loading}
        title="课程"
        bordered={false}
        extra={
          <div>
            <Icon
              style={{ padding: 5 }}
              type="reload"
              spin={refetching}
              onClick={async () => {
                if (refetching) return;
                setRefetching(true);
                await Promise.all([wait(1000), refetch()]);
                setRefetching(false);
              }}
            />
            <Button
              type="primary"
              icon="plus"
              shape="round"
              onClick={() => {
                push('/dashboard/course/add');
              }}
            >
              添加
            </Button>
          </div>
        }
        style={{ flex: 1, margin: '-10px -10px 0 -24px' }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={courses}
          pagination={{
            size: 'small',
            total: totalItems,
            pageSize: limit,
            current: page,
            showSizeChanger: true,
            pageSizeOptions: ['2', '4', '8', '16'],
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
      </Card>
    </div>
  );
};
export default withApollo(Courses);

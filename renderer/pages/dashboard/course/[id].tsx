import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { API_COURSE } from '../../../lib/gql';
import { Course } from '../../../interfaces';
import { Alert, Row, Col, Typography, Icon, Divider, Spin, Table } from 'antd';
import { withApollo } from '../../../lib/apollo';
import Link from 'next/link';

export default withApollo(function CourseDetail() {
  const { query } = useRouter();

  const { loading, error, data, refetch } = useQuery<{ api_course: Course }>(
    API_COURSE,
    {
      variables: {
        id: +query.id,
      },
    },
  );

  const detail = (data && data.api_course) || ({} as Course);

  return (
    <div>
      <Row type="flex" style={{ flex: '0 0 auto' }}>
        <Col style={{ flex: 1 }}>
          <Typography.Title level={3}>
            课程详情 【{detail.name} 】
          </Typography.Title>
        </Col>
        <Col>
          <Divider type="vertical" />
          <Icon style={{ padding: 5 }} type="reload" onClick={refetch} />
        </Col>
      </Row>
      {error ? <Alert type="error" message={error.message} /> : null}
      <Spin spinning={loading}>
        <p>{JSON.stringify(detail)}</p>
        <Typography.Title level={4}>关联的范字演示</Typography.Title>
        <Table
          rowKey="id"
          dataSource={detail.demonstrates}
          columns={[
            {
              title: '演示名称',
              dataIndex: 'title',
              key: 'title',
              render: (text, record) => (
                <Link
                  href="/dashboard/demonstrate/detail/[id]"
                  as={`/dashboard/demonstrate/detail/${record.id}`}
                >
                  <a>{text}</a>
                </Link>
              ),
            },
            {
              title: '详细描述',
              dataIndex: 'desc',
              key: 'desc',
            },
          ]}
        />
      </Spin>
    </div>
  );
});

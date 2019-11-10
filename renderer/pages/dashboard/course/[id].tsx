import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { API_COURSE } from '../../../lib/gql';
import { Course } from '../../../interfaces';
import { Alert, Row, Col, Typography, Divider, Spin, List, Button } from 'antd';
import { withApollo } from '../../../lib/apollo';
import Link from 'next/link';
import IconWithLoading from '../../../components/IconWithLoading';
import DemonSelector from '../../../components/selector/DemonSelector';
import { relateCourse } from '../../../lib/api';

export default withApollo(function CourseDetail() {
  const { query } = useRouter();
  const id = +query.id;

  const { loading, error, data, refetch } = useQuery<{ api_course: Course }>(
    API_COURSE,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        id,
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
          <IconWithLoading
            style={{ padding: 5 }}
            type="reload"
            onClick={() => refetch()}
          />
        </Col>
      </Row>
      {error ? <Alert type="error" message={error.message} /> : null}
      <Spin spinning={loading}>
        <p>{JSON.stringify(detail)}</p>
        <Typography.Title level={4}>关联的范字演示</Typography.Title>
        <Row type="flex" gutter={10}>
          <Col style={{ flex: 1 }}>
            <List
              bordered
              dataSource={detail.demonstrates || []}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Link
                      href="/dashboard/demonstrate/detail/[id]"
                      as={`/dashboard/demonstrate/detail/${item.id}`}
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
            <DemonSelector
              by={+query.id}
              onSelected={demonstrateId => {
                relateCourse(demonstrateId, id);
              }}
            />
          </Col>
        </Row>
      </Spin>
    </div>
  );
});

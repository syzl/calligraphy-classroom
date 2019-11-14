import React from 'react';
import { Divider, Row, Col, Card, Typography, List } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { PagedResult, Course } from '../../../interfaces';
import { API_COURSES } from '../../../lib/gql';
import { withApollo } from '../../../lib/apollo';
import Link from 'next/link';

export default withApollo(function StudentCourseView() {
  const { loading, error, data, refetch, fetchMore, updateQuery } = useQuery<{
    api_courses: PagedResult<Course>;
  }>(API_COURSES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: 10,
      page: 1,
    },
  });

  const { items: courses, next } =
    (data && data.api_courses) || ({} as PagedResult<Course>);
  console.info(next, error, refetch, fetchMore, updateQuery);
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{ minWidth: 540, minHeight: 300 }}
        title="学习"
        loading={loading}
      >
        <Row type="flex">
          <Col style={{ flex: 1 }}>
            <Typography.Title level={4}>选择课程</Typography.Title>
            <Divider />
            <List
              grid={{
                gutter: 6,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
              }}
              dataSource={courses}
              renderItem={item => (
                <List.Item>
                  <Card title={item.name} bordered={false} extra={<Link href='/student/course/[id]' as={`/student/course/${item.id}`}>详细</Link>}>
                    <Card.Meta>{item.desc}</Card.Meta>
                  </Card>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
});

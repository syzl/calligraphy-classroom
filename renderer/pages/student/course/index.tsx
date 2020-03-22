import React from 'react';
import { Card, List, Button, Typography } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { PagedResult, Course } from '../../../interfaces';
import { API_COURSES } from '../../../lib/gql';
import { withApollo } from '../../../lib/apollo';
import Link from 'next/link';
import IconWithLoading from '../../../components/IconWithLoading';

export default withApollo(function StudentCourseView() {
  const { loading, error, data, refetch, fetchMore, updateQuery } = useQuery<{
    api_courses: PagedResult<Course>;
  }>(API_COURSES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: 20,
      page: 1,
    },
  });

  const { items: courses, next } =
    (data && data.api_courses) || ({} as PagedResult<Course>);
  console.info(next, error, refetch, fetchMore, updateQuery);
  return (
    <Card
      bordered={false}
      loading={loading}
      title="选择课程"
      extra={<IconWithLoading type="reload" onClick={() => refetch()} />}
    >
      <List
        grid={{
          gutter: 4,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 6,
        }}
        dataSource={courses}
        renderItem={item => (
          <List.Item>
            <Card
              size="small"
              title={item.name}
              extra={ null &&
                <Link
                  href="/student/course/[id]"
                  as={`/student/course/${item.id}`}
                >
                  <a>详细</a>
                </Link>
              }
            >
              <Card.Meta
                style={{ height: 240, overflow: 'auto' }}
                // title={item.desc}
                description={
                  <List
                        size="small"
                        dataSource={item.demonstrates}
                        renderItem={demon => (
                          <List.Item
                            actions={[
                              <Link
                                href="/student/demonstrate/[id]"
                                as={`/student/demonstrate/${demon.id}`}
                              >
                                <Button type="link">学习</Button>
                              </Link>,
                            ]}
                          >
                            <List.Item.Meta
                              title={
                                <Typography.Text strong>
                                  {demon.title.replace(`${item.name} `,'')}
                                </Typography.Text>
                              }
                            />
                          </List.Item>
                        )}
                      />
                }
              ></Card.Meta>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
});

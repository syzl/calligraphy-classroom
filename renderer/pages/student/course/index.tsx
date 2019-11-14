import React from 'react';
import { Card, List, Button, Typography, Collapse } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { PagedResult, Course } from '../../../interfaces';
import { API_COURSES } from '../../../lib/gql';
import { withApollo } from '../../../lib/apollo';
import Link from 'next/link';
import IconWithLoading from '../../../components/IconWithLoading';

const panelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
};

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
              extra={
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
                  <Collapse bordered={false} defaultActiveKey={['1']}>
                    <Collapse.Panel
                      header="视频学习"
                      key="1"
                      style={panelStyle}
                    >
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
                                  {demon.title}
                                </Typography.Text>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Collapse.Panel>
                  </Collapse>
                }
              ></Card.Meta>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
});

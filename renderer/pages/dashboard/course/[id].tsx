import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { API_COURSE } from '../../../lib/gql';
import { Course } from '../../../interfaces';
import { Alert, Row, Col, Typography, Divider, Spin, Input, Form } from 'antd';
import { withApollo } from '../../../lib/apollo';
import IconWithLoading from '../../../components/IconWithLoading';
import DemonOperator from '../../../components/selector/DemonOperator';
import { relateCourse } from '../../../lib/api';

export default withApollo(function CourseDetail() {
  const { query } = useRouter();
  const id = +query.id;

  const { loading, error, data, refetch } = useQuery<{
    api_course: Course;
  }>(API_COURSE, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id,
    },
  });

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
        <Form>
          <Form.Item>
            <Input addonBefore="课堂名称" value={detail.name} />
          </Form.Item>
          <Form.Item label="描述">
            <Input.TextArea placeholder="课堂描述" value={detail.desc} />
          </Form.Item>
          <Form.Item>
            <Input addonBefore="讲师" value={detail.teacher} />
          </Form.Item>
        </Form>

        <Typography.Title level={4}>关联内容:</Typography.Title>
        <DemonOperator
          by={+query.id}
          onSelected={demonstrateId => {
            relateCourse(demonstrateId, id);
          }}
        />
      </Spin>
    </div>
  );
});

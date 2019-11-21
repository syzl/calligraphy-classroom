import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { API_COURSE } from '../../../lib/gql';
import { Course } from '../../../interfaces';
import { Alert, Row, Col, Typography, Divider, Spin } from 'antd';
import { withApollo } from '../../../lib/apollo';
import IconWithLoading from '../../../components/IconWithLoading';
import DemonOperator from '../../../components/selector/DemonOperator';
import { relateCourse } from '../../../lib/api';
import FieldItem from '../../../components/forms/FieldItem';

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
          <Typography.Title level={4}>编辑课程详情</Typography.Title>
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
        <FieldItem
          value={detail.name}
          label="课堂名称"
          onUpdate={str => {
            //
            console.info('str:', str);
          }}
        />
        <Divider />
        <FieldItem
          value={detail.desc}
          label="课堂描述"
          onUpdate={str => {
            //
            console.info('str:', str);
          }}
        />
        <Divider />
        <FieldItem
          value={detail.teacher}
          label="讲师"
          onUpdate={str => {
            //
            console.info('str:', str);
          }}
        />
        <Divider />

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

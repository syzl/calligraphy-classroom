import React, { useState } from 'react';
import { Tag, Row, Col, Typography, Icon, Divider, Alert, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import * as GQL from '../../../lib/gql';
import { wait } from '../../../lib/utils';
import { withApollo } from '../../../lib/apollo';
import { Demonstrate } from '../../../interfaces';
// import UpdateDemonstrate from '../../../components/forms/UpdateDemonstrate';
import RelatedDemonVideos from '../../../components/relatedEntity/DemonVideos';
import Link from 'next/link';

export default withApollo(function DemonStrateDetail() {
  const { query } = useRouter();

  const [refetching, setRefetching] = useState(false);
  const { data, loading, error, refetch } = useQuery<{
    api_demonstrate: Demonstrate;
  }>(GQL.API_DEMONSTRATE, {
    variables: { id: Number(query.id) },
  });
  const refetchWithMarking = async () => {
    if (refetching) return;
    setRefetching(true);
    await Promise.all([wait(1000), refetch()]);
    setRefetching(false);
  };

  const details: Demonstrate = data ? data.api_demonstrate : ({} as any);

  delete details.videos;

  return (
    <div>
      <Row type="flex" style={{ flex: '0 0 auto' }}>
        <Col style={{ flex: 1 }}>
          <Typography.Title level={3}>
            演示内容 【{details.title} 】
          </Typography.Title>
        </Col>
        <Col>
          <Tag>{details.type}</Tag>
          <Divider type="vertical" />
          <Tag>{details.subType || '-'}</Tag>
          <Divider type="vertical" />
          {!details.course ? null : (
            <>
              <Link
                href="/dashboard/course/[id]"
                as={`/dashboard/course/${details.course.id}`}
              >
                <a>课程: {details.course.name}</a>
              </Link>

              <Divider type="vertical" />
            </>
          )}
          <Icon
            style={{ padding: 5 }}
            type="reload"
            spin={refetching}
            onClick={refetchWithMarking}
          />
        </Col>
      </Row>
      {error ? <Alert message={error.message} type="warning" closable /> : null}
      <Spin spinning={loading}>
        <Typography.Text>{details.desc}</Typography.Text>
        <RelatedDemonVideos />

        <Divider />
        <Row>
          <Alert type="info" message="TODO: 关联的范字, 关联的作业" />
        </Row>
      </Spin>
    </div>
  );
});

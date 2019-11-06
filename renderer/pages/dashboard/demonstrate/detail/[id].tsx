import React, { useState } from 'react';
import { Tag, Row, Col, Typography, Icon, Divider, Card, Alert } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import * as GQL from '../../../../lib/gql';
import { wait } from '../../../../lib/utils';
import { withApollo } from '../../../../lib/apollo';
import { Demonstrate } from '../../../../interfaces';
import UpdateDemonstrate from '../../../../components/forms/UpdateDemonstrate';

export default withApollo(function DemonStrateDetail() {
  const { query } = useRouter();

  const [refetching, setRefetching] = useState(false);
  const { data, loading, error, refetch } = useQuery<{
    api_demonstrate: Demonstrate;
  }>(GQL.API_DEMOSTRATE, {
    variables: { id: Number(query.id) },
  });
  const refetchWithMarking = async () => {
    if (refetching) return;
    setRefetching(true);
    await Promise.all([wait(1000), refetch()]);
    setRefetching(false);
  };

  const details: Demonstrate = data ? data.api_demonstrate : ({} as any);

  return (
    <div>
      <Row type="flex" style={{ flex: '0 0 auto' }}>
        <Col style={{ flex: 1 }}>
          <Typography.Title level={3}>
            演示内容 【{details.title} 】
          </Typography.Title>
        </Col>
        <Col>
          <Icon
            style={{ padding: 5 }}
            type="reload"
            spin={refetching}
            onClick={refetchWithMarking}
          />
          <Divider type="vertical" />
        </Col>
      </Row>
      <div className="meta">
        <Tag>硬笔</Tag>
      </div>
      <Divider />
      {error ? <Alert message={error.message} type="warning" closable /> : null}
      <Card loading={loading}>
        {data && <UpdateDemonstrate data={data.api_demonstrate} />}
      </Card>
      <Divider />
    </div>
  );
});

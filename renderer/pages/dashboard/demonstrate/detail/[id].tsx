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
  const { data, loading, error, refetch, updateQuery } = useQuery<{
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

  const updateSubVideoCache = function(videoId?: any) {
    updateQuery(prev => {
      const {
        api_demonstrate: { videos = [] },
      } = prev;
      return {
        api_demonstrate: {
          ...prev.api_demonstrate,
          videos: videos.filter(item => item.id !== videoId),
        },
      };
    });
  };

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
            type="minus"
            onClick={() => updateSubVideoCache()}
          />
          <Divider type="vertical" />
          <Icon
            style={{ padding: 5 }}
            type="reload"
            spin={refetching}
            onClick={refetchWithMarking}
          />
        </Col>
      </Row>
      <div className="meta">
        <Tag>硬笔</Tag>
      </div>
      <Divider />
      {error ? <Alert message={error.message} type="warning" closable /> : null}
      <Card loading={loading}>
        {data && (
          <UpdateDemonstrate
            data={data.api_demonstrate}
            onDeleteVideo={id => updateSubVideoCache(id)}
          />
        )}
      </Card>
      <Divider />
      <Row>
        <Alert type="info" message="TODO: 关联的范字, 关联的作业" />
      </Row>
    </div>
  );
});

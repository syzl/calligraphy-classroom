import React, { useState } from 'react';
import {
  Tag,
  Row,
  Col,
  Icon,
  Divider,
  Alert,
  Spin,
  Card,
  Typography,
  List,
  Avatar,
} from 'antd';
import { useRouter } from 'next/router';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import * as GQL from '../../../lib/gql';
import { wait } from '../../../lib/utils';
import { withApollo } from '../../../lib/apollo';
import { Demonstrate } from '../../../interfaces';
import RelatedDemonVideos from '../../../components/relatedEntity/DemonVideos';
import FieldItem from '../../../components/forms/FieldItem';
import Link from 'next/link';
import { holderCardProp } from '../../../lib/common';
import { SERVER_URL } from '../../../lib/constant';
import { Button_ } from '../../../components/LoadingWrapper';

import { videoRelateDemon } from '../../../lib/api';
import { S_DEMON_VIDEO } from '../../../lib/gql';

export default withApollo(function DemonStrateDetail() {
  const { query } = useRouter();
  const id = Number(query.id);
  const [refetching, setRefetching] = useState(false);
  const { data, loading, error, refetch } = useQuery<{
    api_demonstrate: Demonstrate;
  }>(GQL.API_DEMONSTRATE, {
    variables: { id },
  });
  const refetchWithMarking = async () => {
    if (refetching) return;
    setRefetching(true);
    await Promise.all([wait(1000), refetch()]);
    setRefetching(false);
  };

  useSubscription(S_DEMON_VIDEO, {
    variables: { demonId: id },
  });

  const details: Demonstrate = data ? data.api_demonstrate : ({} as any);

  return (
    <Card
      {...holderCardProp}
      title="编辑演示内容详情"
      extra={
        <Row type="flex" style={{ flex: '0 0 auto' }}>
          <Col style={{ flex: 1 }}></Col>
          <Col>
            <Tag>{details.type || '-'}</Tag>
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
      }
    >
      {error ? <Alert message={error.message} type="warning" closable /> : null}
      <Spin spinning={loading}>
        <FieldItem
          value={details.title}
          label="标题"
          onUpdate={str => {
            //
            console.info('str:', str);
          }}
        />
        <FieldItem
          value={details.desc}
          label="描述"
          onUpdate={str => {
            //
            console.info('str:', str);
          }}
        />
        <Divider>
          <Typography.Text type="secondary">关联数据</Typography.Text>
        </Divider>

        <Row type="flex" gutter={16}>
          <Col style={{ flex: 2 }}>
            <List
              header={<Typography.Text strong>已关联</Typography.Text>}
              bordered
              dataSource={details.videos || []}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Link
                      href="/dashboard/demonstrate/video/[id]"
                      as={`/dashboard/demonstrate/video/${item.id}`}
                    >
                      <a>详情</a>
                    </Link>,
                    <Button_
                      type="link"
                      icon="disconnect"
                      onClick={() => videoRelateDemon(item.id, -1)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      item.thumb ? (
                        <Avatar
                          shape="square"
                          size={72}
                          src={`${SERVER_URL}/${item.thumb.raw.path.replace(
                            /^_static\//,
                            '',
                          )}`}
                        />
                      ) : (
                        <Avatar shape="square" size={72}>
                          -
                        </Avatar>
                      )
                    }
                    title={item.id}
                    description={`${item.duration / 1000} s`}
                  ></List.Item.Meta>
                </List.Item>
              )}
            />
          </Col>
          <Col style={{ flex: '0 0 200px' }}>
            <RelatedDemonVideos />
          </Col>
        </Row>
      </Spin>
    </Card>
  );
});

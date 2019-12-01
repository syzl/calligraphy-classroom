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
import { useQuery, useSubscription, useMutation } from '@apollo/react-hooks';
import * as GQL from '../../../lib/gql';
import { wait } from '../../../lib/utils';
import { withApollo } from '../../../lib/apollo';
import { Demonstrate, FieldMeta } from '../../../interfaces';
import RelatedDemonVideos from '../../../components/relatedEntity/DemonVideos';
import FieldItem from '../../../components/forms/FieldItem';
import Link from 'next/link';
import { holderCardProp } from '../../../lib/common';
import { SERVER_URL } from '../../../lib/constant';
import { Button_ } from '../../../components/LoadingWrapper';

import { videoRelateDemon } from '../../../lib/api';
import { S_DEMON_VIDEO, UPDATE_DEMONSTRATE } from '../../../lib/gql';

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

  const [updatePart] = useMutation<
    {
      updated: Demonstrate;
    },
    {
      id: number;
      data: {
        title?: string;
        desc?: string;
      };
    }
  >(UPDATE_DEMONSTRATE);

  const detail: Demonstrate = data ? data.api_demonstrate : ({} as any);

  const fieldMetas: FieldMeta<Demonstrate, string | undefined>[] = [
    {
      label: '环节名称',
      key: 'title',
    },
    {
      label: '环节描述',
      key: 'desc',
    },
  ];

  return (
    <Card
      {...holderCardProp}
      title="编辑演示内容详情"
      extra={
        <Row type="flex" style={{ flex: '0 0 auto' }}>
          <Col style={{ flex: 1 }}></Col>
          <Col>
            <Tag>{detail.type || '-'}</Tag>
            <Divider type="vertical" />
            <Tag>{detail.subType || '-'}</Tag>
            <Divider type="vertical" />
            {!detail.course ? null : (
              <>
                <Link
                  href="/dashboard/course/[id]"
                  as={`/dashboard/course/${detail.course.id}`}
                >
                  <a>课程: {detail.course.name}</a>
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
        {/* 更新文字字段 */}
        {fieldMetas.map(fieldMeta => (
          <FieldItem
            value={detail[fieldMeta.key]}
            key={fieldMeta.label}
            label={fieldMeta.label}
            onUpdate={str =>
              updatePart({
                variables: { id, data: { [fieldMeta.key]: str } },
              })
            }
          />
        ))}
        <Divider>
          <Typography.Text type="secondary">关联数据</Typography.Text>
        </Divider>

        <Row type="flex" gutter={16}>
          <Col style={{ flex: 2 }}>
            <List
              header={<Typography.Text strong>已关联</Typography.Text>}
              bordered
              dataSource={detail.videos || []}
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

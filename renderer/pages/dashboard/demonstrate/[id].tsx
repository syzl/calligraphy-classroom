import React from 'react';
import Link from 'next/link';
import {
  API_DEMONSTRATE,
  UPDATE_DEMONSTRATE,
  S_DEMON_VIDEO,
} from '../../../lib/gql';
import { FieldMeta, Demonstrate } from '../../../interfaces';
import {
  Alert,
  Row,
  Col,
  Typography,
  Divider,
  Spin,
  Card,
  List,
  Avatar,
  Tag,
  Tooltip,
} from 'antd';
import { useRouter } from 'next/router';
import { withApollo } from '../../../lib/apollo';
import { videoRelateDemon } from '../../../lib/api';
import FieldItem from '../../../components/forms/FieldItem';
import { Button_ } from '../../../components/LoadingWrapper';
import { holderCardProp } from '../../../lib/common';
import { withQueryDetail } from '../../../components/gql/QueryDetailWrapper';
import { SERVER_URL } from '../../../lib/constant';
import RelatedDemonVideos from '../../../components/relatedEntity/DemonVideos';
import IconWithLoading from '../../../components/IconWithLoading';

export default withApollo(function CourseDetail() {
  const { query } = useRouter();
  const id = +query.id;

  const fieldMetas: FieldMeta<Demonstrate>[] = [
    {
      label: '环节名称',
      key: 'title',
    },
    {
      label: '环节描述',
      key: 'desc',
    },
  ];

  return withQueryDetail<Demonstrate, 'api_demonstrate', 'update', 'demonId'>(
    {
      id,
      queryKey: 'api_demonstrate',
      subscrbeKey: 'demonId',
      gqlDetail: API_DEMONSTRATE,
      gqlUpdate: UPDATE_DEMONSTRATE,
      gqlSubscribe: S_DEMON_VIDEO,
    },
    function({ detail, loading, error, refetch, updatePart }) {
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
                <Divider type="vertical" />
                <Tooltip title="刷新">
                  <IconWithLoading
                    style={{ padding: 5 }}
                    type="reload"
                    onClick={() => refetch()}
                  />
                </Tooltip>
              </Col>
            </Row>
          }
        >
          {error ? (
            <Alert message={error.message} type="warning" closable />
          ) : null}
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
    },
  );
});

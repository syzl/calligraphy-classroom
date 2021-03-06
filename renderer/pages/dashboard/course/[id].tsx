import React from 'react';
import Link from 'next/link';
import {
  API_COURSE,
  UPDATE_COURSE,
  S_COURSE_DEMON_RELATION,
} from '../../../lib/gql';
import { Course, FieldMeta } from '../../../interfaces';
import {
  Alert,
  Row,
  Col,
  Typography,
  Divider,
  Spin,
  Card,
  Tooltip,
  List,
  Avatar,
} from 'antd';
import { useRouter } from 'next/router';
import { withApollo } from '../../../lib/apollo';
import IconWithLoading from '../../../components/IconWithLoading';
import DemonOperator from '../../../components/selector/DemonOperator';
import { relateCourse } from '../../../lib/api';
import FieldItem from '../../../components/forms/FieldItem';
import { Button_ } from '../../../components/LoadingWrapper';
import { holderCardProp } from '../../../lib/common';
import { withQueryDetail } from '../../../components/gql/QueryDetailWrapper';

export default withApollo(function CourseDetail() {
  const { query } = useRouter();
  const id = +query.id;
  const fieldMetas: FieldMeta<Course>[] = [
    {
      label: '课堂名称',
      key: 'name',
    },
    {
      label: '课堂描述',
      key: 'desc',
    },
    {
      label: '课堂讲师',
      key: 'teacher',
    },
  ];

  return withQueryDetail<Course, 'api_course', 'update', 'courseId'>(
    {
      id,
      queryKey: 'api_course',
      subscrbeKey: 'courseId',
      gqlDetail: API_COURSE,
      gqlUpdate: UPDATE_COURSE,
      gqlSubscribe: S_COURSE_DEMON_RELATION,
    },
    function({ detail, loading, error, refetch, updatePart }) {
      return (
        <Card
          {...holderCardProp}
          title="编辑课程详情"
          extra={
            <Row type="flex" style={{ flex: '0 0 auto' }}>
              <Col>
                <Tooltip title={`CreatedAt ${detail.createdAt}`}>
                  <Typography.Text type="secondary">
                    {detail.updatedAt}
                  </Typography.Text>
                </Tooltip>
              </Col>
              <Col>
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
          {error ? <Alert type="error" message={error.message} /> : null}
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
                  dataSource={detail.demonstrates || []}
                  header={
                    <Typography.Text strong>关联的范字演示</Typography.Text>
                  }
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Link
                          href="/dashboard/demonstrate/[id]"
                          as={`/dashboard/demonstrate/${item.id}`}
                        >
                          <a>详情</a>
                        </Link>,
                        <Button_
                          type="link"
                          icon="disconnect"
                          onClick={() => relateCourse(item.id, -1)}
                        />,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            shape="square"
                            size="small"
                            style={{ backgroundColor: '#87d068' }}
                          >
                            {item.id}
                          </Avatar>
                        }
                        title={item.title}
                        description={item.desc}
                      />
                    </List.Item>
                  )}
                ></List>
              </Col>
              <Col style={{ flex: 1 }}>
                <DemonOperator
                  by={id}
                  onSelected={async demonstrateId => {
                    await relateCourse(demonstrateId, id);
                  }}
                />
              </Col>
            </Row>
          </Spin>
        </Card>
      );
    },
  );
});

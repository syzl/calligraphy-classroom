import React from 'react';
import Link from 'next/link';
import { API_DEMON_VIDEO } from '../../../../lib/gql';
import { FieldMeta } from '../../../../interfaces';
import {
  Alert,
  Row,
  Col,
  Typography,
  Divider,
  Spin,
  Card,
  Tooltip,
} from 'antd';
import { useRouter } from 'next/router';
import { DemonstrateVideo } from '../../../../interfaces';
import { withApollo } from '../../../../lib/apollo';
import { withQueryDetail } from '../../../../components/gql/QueryDetailWrapper';
import { holderCardProp } from '../../../../lib/common';
import IconWithLoading from '../../../../components/IconWithLoading';
import FieldItem, {
  FieldItemRaw,
} from '../../../../components/forms/FieldItem';
import { SERVER_URL } from '../../../../lib/constant';
import ReactPlayer from 'react-player';

export default withApollo(function VideoDetail() {
  const { query } = useRouter();
  const id = +query.id;

  const fieldMetas: FieldMeta<DemonstrateVideo, string | number>[] = [
    {
      key: 'startedAt',
      label: '参数',
    },
    {
      label: '临摹视频时长',
      key: 'duration',
    },
    {
      label: '汉字',
      key: 'char',
    },
    {
      label: '备注',
      key: 'remark',
    },
  ];

  return withQueryDetail<DemonstrateVideo, 'api_demon_video'>(
    {
      id,
      queryKey: 'api_demon_video',
      gqlDetail: API_DEMON_VIDEO,
    },
    function({ detail, loading, error, refetch }) {
      return (
        <Card
          {...holderCardProp}
          title="编辑演示内容详情"
          extra={
            <Row type="flex" style={{ flex: '0 0 auto' }}>
              <Col style={{ flex: 1 }}></Col>
              <Col>
                <Divider type="vertical" />
                {!detail.demonstrate ? null : (
                  <>
                    <Link
                      href="/dashboard/demonstrate/[id]"
                      as={`/dashboard/demonstrate/${detail.demonstrate.id}`}
                    >
                      <a>课程: {detail.demonstrate.title}</a>
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
                value={`${detail[fieldMeta.key]}`}
                key={fieldMeta.label}
                label={fieldMeta.label}
              />
            ))}
            <FieldItemRaw label="临摹视频">
              {!(detail.video && detail.video.raw) ? (
                <Typography.Text type="secondary">无</Typography.Text>
              ) : (
                <ReactPlayer
                  width="480px"
                  height="300px"
                  light={detail.thumb ? `${SERVER_URL}/${detail.thumb.raw.path.replace(
                    /^_static\//,
                    '',
                  )}` : undefined}
                  url={`${SERVER_URL}/${detail.video.raw.path.replace(
                    /^_static\//,
                    '',
                  )}`}
                  controls
                />
              )}
            </FieldItemRaw>
          </Spin>
        </Card>
      );
    },
  );
});

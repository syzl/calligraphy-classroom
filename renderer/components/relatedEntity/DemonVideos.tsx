import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { API_DEMON_VIDEOS } from '../../lib/gql';
import { useRouter } from 'next/router';
import {
  Alert,
  Divider,
  Row,
  Col,
  Button,
  Tooltip,
  Collapse,
  Icon,
  Card,
} from 'antd';
import ReactPlayer from 'react-player';

import IconWithLoading from '../IconWithLoading';
import { DemonstrateVideo, PagedResult } from '../../interfaces';
import { SERVER_URL } from '../../lib/constant';

const { Panel } = Collapse;
const panelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 16,
  border: 0,
  overflow: 'hidden',
};

export default function RelatedDemonVideos() {
  const { query } = useRouter();
  const id = +query.id;
  const { loading, error, data, refetch, fetchMore } = useQuery<{
    api_demon_videos: PagedResult<DemonstrateVideo>;
  }>(API_DEMON_VIDEOS, {
    variables: {
      by: id,
    },
  });
  const loadMore = async () => {
    fetchMore({
      variables: {
        page: 1,
      },
      updateQuery(prev, data) {
        console.info('data', data, prev);
        return prev;
      },
    });
  };
  const {
    api_demon_videos: { items = [] },
  } =
    data ||
    ({ api_demon_videos: {} } as {
      api_demon_videos: PagedResult<DemonstrateVideo>;
    });

  // 排序
  items.sort((a, b) => (b.demonstrate && !a.demonstrate ? 1 : -1));

  return (
    <Card
      title="可关联的范字演示"
      loading={loading}
      extra={
        <>
          <Button icon="dash" type="link" onClick={() => loadMore()} />
          <Divider type="vertical" />
          <IconWithLoading type="reload" onClick={() => refetch()} />
        </>
      }
    >
      {error ? <Alert type="error" message={error.message} /> : null}

      <Collapse bordered={false} defaultActiveKey={items.map(item => item.id)}>
        {items.map(item => (
          <Panel
            style={panelStyle}
            key={item.id}
            header={`${item.id} start at: ${item.startedAt}, duration: ${item.duration}`}
            extra={
              <>
                <Icon
                  type="file-image"
                  style={{ color: !item.thumb ? 'lightgrey' : 'dark' }}
                />
                <Divider type="vertical" />
                <Icon
                  type="video-camera"
                  style={{ color: !item.video ? 'lightgrey' : 'dark' }}
                />
                <Divider type="vertical" />
                <Tooltip title={item.demonstrate ? `已关联` : '未关联'}>
                  <Icon
                    type={item.demonstrate ? 'link' : 'disconnect'}
                    style={{ color: !item.demonstrate ? 'lightgrey' : 'dark' }}
                  />
                </Tooltip>
              </>
            }
          >
            <Row type="flex">
              <Col style={{ flex: 1 }}>
                {!(item.video && item.video.raw) ? null : (
                  <div
                    style={{
                      width: 360,
                      height: 200,
                      padding: 3,
                      border: 'thin solid lightgray',
                      borderRadius: 5,
                    }}
                  >
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      light={`${SERVER_URL}/${item.thumb.raw.path.replace(
                        /^_static\//,
                        '',
                      )}`}
                      url={`${SERVER_URL}/${item.video.raw.path.replace(
                        /^_static\//,
                        '',
                      )}`}
                      controls
                    />
                  </div>
                )}
              </Col>
              <Col style={{ flex: '0 0 13em', textAlign: 'right' }}>
                {item.demonstrate ? (
                  <Button type="danger">取消关联</Button>
                ) : (
                  <Button type="primary">关联当前</Button>
                )}
              </Col>
            </Row>
          </Panel>
        ))}
      </Collapse>
    </Card>
  );
}

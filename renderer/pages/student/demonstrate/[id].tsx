import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import {
  Button,
  Divider,
  Row,
  Card,
  Icon,
  Dropdown,
  List,
  Avatar,
  Alert,
  message,
} from 'antd';
import Link from 'next/link';
import { Demonstrate, UploadVideo } from '../../../interfaces';
import { API_DEMONSTRATE } from '../../../lib/gql';
import { withApollo } from '../../../lib/apollo';
import IconWithLoading from '../../../components/IconWithLoading';
import { SERVER_URL } from '../../../lib/constant';

export default withApollo(function DemonstrateDetail() {
  const { query } = useRouter();
  const { data, loading, error, refetch } = useQuery<{
    api_demonstrate: Demonstrate;
  }>(API_DEMONSTRATE, {
    variables: { id: Number(query.id) },
  });
  console.info(' data, loading, error, refetch');
  const detail = (data && data.api_demonstrate) || ({} as Demonstrate);
  const { course } = detail;
  const [targetVideo, setTargetVideo] = useState({} as UploadVideo);
  return (
    <Card
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      title={detail.title}
      size="small"
      loading={loading}
      bordered={false}
      extra={
        <Row>
          <IconWithLoading type="reload" onClick={() => refetch()} />
          <Divider type="vertical" />
          <Link href="/student/course">
            <Button type="link">课程列表</Button>
          </Link>
          <Divider type="vertical" />
          {course ? (
            <Button type="link" icon="arrow-right">
              课程: {course.name}
            </Button>
          ) : null}
        </Row>
      }
      actions={[
        <Dropdown
          trigger={['click']}
          overlay={
            <List
              dataSource={detail.videos}
              renderItem={video => (
                <List.Item
                  onClick={() => {
                    setTargetVideo(video.video);
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      video.thumb ? (
                        <Avatar
                          size={72}
                          shape="square"
                          src={`${SERVER_URL}/${video.thumb.raw.path.replace(
                            /^_static\//,
                            '',
                          )}`}
                        />
                      ) : null
                    }
                    description={`${video.duration / 1000} s`}
                  />
                </List.Item>
              )}
            />
          }
          placement="topLeft"
        >
          <Button
            disabled={!detail.videos || !detail.videos.length}
            type="link"
            icon="video-camera"
            block
          />
        </Dropdown>,

        <Icon type="setting" key="setting" />,
        <Icon type="edit" key="edit" />,
        <Icon type="ellipsis" key="ellipsis" />,
      ]}
      bodyStyle={{ flex: 1, overflow: 'auto' }}
    >
      {error ? <Alert type="error" message={message.error} /> : null}
      <div>
        <pre>{JSON.stringify(targetVideo, null, 1)}</pre>
      </div>
    </Card>
  );
});

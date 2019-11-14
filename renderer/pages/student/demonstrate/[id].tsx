import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import {
  Button,
  Divider,
  Row,
  Card,
  Icon,
  List,
  Avatar,
  Alert,
  message,
  Typography,
  Col,
} from 'antd';
import Link from 'next/link';
import { Rnd } from 'react-rnd';
import { Demonstrate, DemonstrateVideo } from '../../../interfaces';
import { API_DEMONSTRATE } from '../../../lib/gql';
import { withApollo } from '../../../lib/apollo';
import IconWithLoading from '../../../components/IconWithLoading';
import { SERVER_URL } from '../../../lib/constant';
import ReactPlayer from 'react-player';
import { wait } from '../../../lib/utils';

export default withApollo(function DemonstrateDetail() {
  const { query } = useRouter();
  const { data, loading, error, refetch } = useQuery<{
    api_demonstrate: Demonstrate;
  }>(API_DEMONSTRATE, {
    variables: { id: Number(query.id) },
  });
  const detail = (data && data.api_demonstrate) || ({} as Demonstrate);
  const { course } = detail;
  const [targetDemon, setTargetDemon] = useState({} as DemonstrateVideo);
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
        <Button
          disabled={!targetDemon.id}
          type="link"
          icon="video-camera"
          block
          onClick={() => {
            setTargetDemon({} as any);
          }}
        />,

        <Icon type="setting" key="setting" />,
        <Icon type="edit" key="edit" />,
        <Icon type="ellipsis" key="ellipsis" />,
      ]}
      bodyStyle={{ flex: 1, overflow: 'auto' }}
    >
      {error ? <Alert type="error" message={message.error} /> : null}
      <Row type="flex" style={{ height: '100%' }}>
        <Col style={{ flex: '0 1 240px' }}>
          <List
            header={<Typography.Text>范字演示:</Typography.Text>}
            dataSource={detail.videos}
            renderItem={demon => (
              <List.Item
                onClick={async () => {
                  if (targetDemon.id !== demon.id) {
                    setTargetDemon({} as any);
                    await wait(20);
                    setTargetDemon(demon);
                  }
                }}
              >
                <List.Item.Meta
                  avatar={
                    demon.thumb ? (
                      <Avatar
                        size={72}
                        shape="square"
                        src={`${SERVER_URL}/${demon.thumb.raw.path.replace(
                          /^_static\//,
                          '',
                        )}`}
                      />
                    ) : null
                  }
                  description={`${demon.duration / 1000} s`}
                />
              </List.Item>
            )}
          />
        </Col>
        <Col style={{ flex: 1 }}>
          <div>
            {!targetDemon.video ? null : (
              <Rnd
                default={{
                  x: 0,
                  y: 0,
                  width: 320,
                  height: 200,
                }}
                lockAspectRatio
                bounds="body"
                dragHandleClassName="player-drag"
                minWidth={64}
                minHeight={40}
                resizeHandleComponent={{
                  bottomRight: <Button shape="circle" icon="arrows-alt" />,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'thin solid lightgray',
                    background: '#fff',
                  }}
                >
                  <ReactPlayer
                    light={`${SERVER_URL}/${targetDemon.thumb.raw.path.replace(
                      /^_static\//,
                      '',
                    )}`}
                    className="player"
                    controls={true}
                    url={`${SERVER_URL}/${targetDemon.video.raw.path.replace(
                      /^_static\//,
                      '',
                    )}`}
                    width="100%"
                    height="100%"
                  />
                  <Row type="flex">
                    <Col>
                      <Button
                        icon="drag"
                        type="ghost"
                        shape="circle"
                        style={{
                          cursor: 'move',
                        }}
                        className="player-drag"
                      />
                    </Col>
                    <Col></Col>
                  </Row>
                </div>
              </Rnd>
            )}
          </div>
        </Col>
        <Col style={{ flex: 1 }}></Col>
      </Row>
      <style global jsx>{`
        body {
          overflow: hidden;
        }
      `}</style>
    </Card>
  );
});

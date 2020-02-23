import React, { useState, useRef } from 'react';
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
import { Demonstrate, DemonstrateVideo, Copybook } from '../../../interfaces';
import { API_DEMONSTRATE } from '../../../lib/gql';
import { withApollo } from '../../../lib/apollo';
import IconWithLoading from '../../../components/IconWithLoading';
import { SERVER_URL } from '../../../lib/constant';
import ReactPlayer from 'react-player';
import { wait } from '../../../lib/utils';
import { holderCardProp } from '../../../lib/common';
import { captureVideoFrame } from '../../../lib/video/capture-video-frame';

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
  const [targetCopybook, setTargetCopybook] = useState({} as Copybook);

  const copybooks =
    targetDemon.copybooks ||
    (detail.videos || []).reduce(
      (result, video) => [...result, ...(video.copybooks || [])],
      [] as Copybook[],
    );
  const [playingCache, setPlayingCache] = useState<boolean>();
  const [previewData, setPreviewData] = useState(
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
  );
  const [playing, setPlaying] = useState(false);
  const [dragging, setDragging] = useState(false);
  const player = useRef<ReactPlayer>(null);
  return (
    <Card
      {...holderCardProp}
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
    >
      {error ? <Alert type="error" message={message.error} /> : null}
      <Row type="flex" style={{ height: '100%' }}>
        <Col style={{ flex: '0 1 240px' }}>
          <List
            header={<Typography.Text>范字演示:</Typography.Text>}
            dataSource={detail.videos}
            renderItem={demon => (
              <List.Item
                style={
                  targetDemon.id === demon.id ? { background: 'lightblue' } : {}
                }
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
        <Col style={{ flex: '0 1 300px' }}>
          <List
            header={<Typography.Text>关联字帖:</Typography.Text>}
            dataSource={copybooks}
            renderItem={copybook => (
              <List.Item
                onClick={async () => {
                  setTargetCopybook(copybook);
                }}
              >
                <List.Item.Meta
                  avatar={
                    copybook.raw ? (
                      <Avatar
                        size={144}
                        shape="square"
                        src={`${SERVER_URL}/${copybook.raw.path.replace(
                          /^_static\//,
                          '',
                        )}`}
                      />
                    ) : null
                  }
                />
              </List.Item>
            )}
          />
        </Col>
        <Col style={{ flex: 1, position: 'relative', zIndex: 999 }}>
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
                dragGrid={[20, 32]}
                resizeHandleComponent={{
                  bottomRight: <Button shape="circle" icon="arrows-alt" />,
                }}
                onDragStart={() => {
                  if (player.current) {
                    const el = player.current.getInternalPlayer() as any;
                    if (el) {
                      const { dataUri } = captureVideoFrame(el);
                      if (dataUri) {
                        setPreviewData(dataUri);
                      }
                    }
                  }
                  setDragging(true);
                  setPlayingCache(playing);
                  setPlaying(false);
                }}
                onDragStop={() => {
                  setDragging(false);
                  setPlaying(!!playingCache);
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'thin solid lightgray',
                    background: '#fff',
                    position: 'relative',
                  }}
                >
                  <div
                    className="player-cover"
                    style={{
                      backgroundImage: `url(${previewData})`,
                      visibility: dragging ? 'visible' : 'hidden',
                    }}
                  >
                    {playing ? '' : '拖动中...'}
                  </div>
                  <ReactPlayer
                    ref={player}
                    style={{ visibility: dragging ? 'hidden' : 'visible' }}
                    playing={playing}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
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
                    config={{
                      file: {
                        attributes: {
                          crossOrigin: 'true',
                        },
                      },
                    }}
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
          <div>
            {!targetCopybook.raw ? null : (
              <Rnd
                default={{
                  x: 0,
                  y: 200,
                  width: 320,
                  height: 200,
                }}
                bounds="body"
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
                    overflow: 'hidden',
                    background: 'lightgray',
                    display: 'flex',
                    alignItems: 'center',
                    border: 'thin solid lightgray',
                  }}
                >
                  <img
                    className="cp-img"
                    style={{
                      width: '100%',
                      height: 'auto',
                      pointerEvents: 'none',
                    }}
                    src={`${SERVER_URL}/${targetCopybook.raw.path.replace(
                      /^_static\//,
                      '',
                    )}`}
                  />
                </div>
              </Rnd>
            )}
          </div>
        </Col>
        <Col style={{ flex: 1 }}>
          {/* <pre>{JSON.stringify(targetCopybook, null, 1)}</pre> */}
        </Col>
      </Row>
      <style global jsx>{`
        body {
          overflow: hidden;
        }
        .cp-img {
          filter: contrast(170%) brightness(170%) invert(100%);
        }
        .player-cover {
          position: absolute;
          height: 100%;
          width: 100%;
          justify-content: center;
          display: flex;
          align-items: center;
          z-index: 100;
          background: rgba(255, 255, 255, 0.6);
          font-size: 24px;

          background: #fff;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center center;
        }
      `}</style>
    </Card>
  );
});

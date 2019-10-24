import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

import {
  Row,
  Col,
  Menu,
  Dropdown,
  Button,
  Slider,
  InputNumber,
  Empty
} from 'antd';

import Nav from '../Nav';
// import CustomController from './CustomController';
import CopyFrame from './CopyFrame';

const styles = require('../Home.css');

const demoData = [
  {
    title: '紫',
    video:
      'https://img.songlairui.cn/self-answer/9e059801fc943ed0e8d7f9b46fa068b6.mp4',
    copyframe:
      'https://img.songlairui.cn/self-answer/a33960408c97b223e7d1d42ef36b2970.jpg'
  },
  {
    title: '天',
    video:
      'https://img.songlairui.cn/self-answer/8b0ee6b0f8f2ad60c4470279b410acd8.mp4',
    copyframe:
      'https://img.songlairui.cn/self-answer/d26599d128d32f928fefe810a9781c15.jpg'
  }
];

export default function Page() {
  const playerRef = useRef<ReactPlayer>();

  const [playing, setPlaying] = useState(false);
  // const [seeking, setSeeking] = useState(false);
  // const [speed, setSpeed] = useState(1);
  // const [played, setPlayed] = useState(0);
  // const [aim, setAim] = useState(0);

  const [scale, setScale] = useState(1);

  const [videoUrl, setVideoUrl] = useState('');
  const [cpFrameUrl, setCpFrameUrl] = useState('');
  const [showMenu, toggleMenu] = useState(false);

  // useThrottleFn(
  //   value => {
  //     // playerRef.current.seekTo(value);
  //   },
  //   30,
  //   [aim]
  // );

  const menu = (
    <Menu>
      {demoData.map(item => (
        <Menu.Item
          key={item.title}
          onClick={async () => {
            setPlaying(false);
            await new Promise(r => setTimeout(r, 120));
            // setVideoUrl('#');
            await new Promise(r => setTimeout(r, 20));
            setVideoUrl(item.video);
            setCpFrameUrl(item.copyframe);
            toggleMenu(false);
          }}
        >
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className={styles.container}>
      <Nav>
        <Dropdown
          overlay={menu}
          placement="bottomLeft"
          trigger={['click']}
          visible={showMenu}
          onVisibleChange={toggleMenu}
        >
          <Button>课程列表 {showMenu}</Button>
        </Dropdown>
      </Nav>
      <Row type="flex" style={{ flex: 1, fontSize: '1em' }}>
        <Col
          span={12}
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          {videoUrl ? (
            <ReactPlayer
              controls={true}
              url={videoUrl}
              ref={playerRef}
              playing={playing}
              // playbackRate={speed}
              progressInterval={40}
              // onProgress={state => {
              //   // setPlayed(state.played);
              //   setPlaying(true);
              // }}
              onPlay={() => {
                setPlaying(true);
              }}
              onPause={() => {
                setPlaying(false);
              }}
              onEnded={() => {
                setPlaying(false);
              }}
              width="100%"
              height="auto"
            />
          ) : (
            <Empty
              image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
              imageStyle={{
                height: 60
              }}
              description={
                <span>
                  请选择
                  <Button
                    type="link"
                    onClick={() => {
                      toggleMenu(true);
                    }}
                  >
                    课程
                  </Button>
                </span>
              }
            />
          )}
          {/* <CustomController
            style={{ display: 'block', width: '100%' }}
            played={played}
            setSeeking={setSeeking}
            setAim={v => {
              setAim(v);
              playerRef.current.seekTo(v);
            }}
            speed={speed}
            setSpeed={setSpeed}
            playing={playing}
            setPlaying={setPlaying}
          /> */}
        </Col>
        <Col
          span={12}
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            boxShadow: '-3px 0 4px -5px'
          }}
        >
          <CopyFrame src={cpFrameUrl} scale={scale} />
        </Col>
      </Row>
      <Row className="debug" type="flex" style={{ flex: 0 }}>
        <Col span={12} style={{ textAlign: 'left' }}>
          <Button
            onClick={() => {
              setPlaying(!playing);
            }}
          >
            {playing ? 'stop' : 'play'}
          </Button>
        </Col>
        <Col span={12}>
          <Row type="flex">
            <Col
              span={2}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              缩放:
            </Col>
            <Col span={12}>
              <Slider
                min={0.2}
                max={3}
                onChange={(val: any) => {
                  val && setScale(val);
                }}
                value={typeof scale === 'number' ? scale : 0}
                step={0.1}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={0.2}
                max={3}
                style={{ marginLeft: 16 }}
                step={0.1}
                value={scale}
                onChange={(val: any) => {
                  val && setScale(val);
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

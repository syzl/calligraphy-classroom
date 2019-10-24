import * as React from 'react';
import ReactPlayer from 'react-player';
import { useThrottleFn } from 'react-use';
import { Row, Col } from 'antd';

import Nav from '../Nav';
import CustomController from './CustomController';

const styles = require('../Home.css');

export default function Page() {
  const playerRef = React.useRef<ReactPlayer>();
  const [playing, setPlaying] = React.useState(false);
  const [seeking, setSeeking] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [played, setPlayed] = React.useState(0);
  const [aim, setAim] = React.useState(0);
  const [tmp, setTmp] = React.useState(0);

  useThrottleFn(
    value => {
      setTmp(value);
      playerRef.current.seekTo(value);
    },
    40,
    [aim]
  );
  return (
    <div className={styles.container}>
      <Nav></Nav>
      <Row type="flex" style={{ flex: 1 }}>
        <Col
          span={12}
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ReactPlayer
            controls={true}
            url="https://img.songlairui.cn/self-answer/9e059801fc943ed0e8d7f9b46fa068b6.mp4"
            ref={playerRef}
            playing={playing}
            playbackRate={speed}
            progressInterval={40}
            onProgress={state => {
              setPlayed(state.played);
            }}
          />
          <CustomController
            style={{ display: 'none' }}
            played={played}
            setSeeking={setSeeking}
            setAim={setAim}
            speed={speed}
            setSpeed={setSpeed}
            playing={playing}
            setPlaying={setPlaying}
          />
        </Col>
        <Col
          span={12}
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img src="https://img.songlairui.cn/self-answer/a33960408c97b223e7d1d42ef36b2970.jpg" />
        </Col>
      </Row>
      <div className="debug">
        {/* <div className={styles.debug}> */}
        {seeking} {tmp}
      </div>
    </div>
  );
}

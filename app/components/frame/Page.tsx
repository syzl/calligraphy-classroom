import * as React from 'react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useThrottleFn } from 'react-use';

const routes = require('../../constants/routes.json');
const styles = require('../Home.css');

export default function Page() {
  const [playing, setPlaying] = React.useState(false);
  const [seeking, setSeeking] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [played, setPlayed] = React.useState(0);
  const playerRef = React.useRef<ReactPlayer>();
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
    <div className={styles.container} data-tid="container">
      <h2>{seeking} Frame Page </h2>
      <h3>{tmp}</h3>
      <ReactPlayer
        url="http://192.168.1.144:5000/%E5%A4%A9.mp4"
        ref={playerRef}
        playing={playing}
        playbackRate={speed}
        progressInterval={40}
        onProgress={state => {
          setPlayed(state.played);
        }}
      />

      <input
        style={{
          width: '100%'
        }}
        type="range"
        min={0}
        max={1}
        step="any"
        value={played}
        onMouseDown={() => setSeeking(true)}
        onChange={e => {
          const val = parseFloat(e.target.value);
          setAim(val);
          // playerRef.current.seekTo(val);
        }}
        onMouseUp={() => {
          setSeeking(false);
          // playerRef.current.seekTo(played);
        }}
      />
      <p>
        <span>Speed {speed}</span>
        <br />
        <input
          type="range"
          min={0.25}
          max={15}
          step="0.25"
          value={speed}
          onChange={e => {
            const val = parseFloat(e.target.value);
            setSpeed(val);
          }}
        />
      </p>
      <button onClick={() => setPlaying(!playing)}>
        {playing ? 'pause' : 'play'}
      </button>
      <br />
      <Link to={routes.HOME}>to Home</Link>
    </div>
  );
}

import * as React from 'react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';

const routes = require('../../constants/routes.json');
const styles = require('../Home.css');

export default function Page() {
  const [seeking, setSeeking] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [played, setPlayed] = React.useState(0);
  const playerRef = React.useRef<ReactPlayer>();
  return (
    <div className={styles.container} data-tid="container">
      <h2>Frame Page </h2>
      <h3>{seeking}</h3>
      <ReactPlayer
        url="http://192.168.1.144:5000/%E5%A4%A9.mp4"
        playing
        ref={playerRef}
        playbackRate={speed}
        progressInterval={30}
        onProgress={state => {
          setPlayed(state.played);
        }}
      />
      <input
        type="range"
        min={0}
        max={1}
        step="any"
        value={played}
        onMouseDown={() => setSeeking(true)}
        onChange={e => {
          const val = parseFloat(e.target.value);
          setPlayed(val);
          playerRef.current.seekTo(val);
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
      <br />
      <Link to={routes.HOME}>to Home</Link>
    </div>
  );
}

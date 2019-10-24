import * as React from 'react';

export default function CustomController({
  played,
  setSeeking,
  setAim,
  speed,
  setSpeed,
  playing,
  setPlaying,
  style
}) {
  return (
    <div style={{ ...style }}>
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
    </div>
  );
}

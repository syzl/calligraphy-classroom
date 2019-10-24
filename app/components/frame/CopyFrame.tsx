import React from 'react';
import Draggable from 'react-draggable';

export default function CopyFrame({ src, scale = 1 }) {
  if (!src) {
    return null;
  }

  return (
    <Draggable bounds="parent">
      <div
        style={{
          //   border: 'thin solid red',
          width: scale * 200,
          height: scale * 200,
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 10
          }}
        />
        <img
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
          src={src}
        />
      </div>
    </Draggable>
  );
}

/**
 * 字帖
 * 可自由缩放
 */

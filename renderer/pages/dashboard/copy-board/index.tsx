import React, { useState } from 'react';
import VideoRecorder from 'react-video-recorder';

import createActions from '../../../components/video-record/render-actions';
import { Button } from 'antd';

const action = (str = '') => (...args: any[]) =>
  console.info(str, ':', ...args);

const handleRecordingComplete = (
  videoBlob: Blob,
  startedAt: number,
  thumbnailBlob: Blob,
  duration: number,
) => {
  const urlCreator = window.URL || window.webkitURL;
  const thumbUrl = thumbnailBlob && urlCreator.createObjectURL(thumbnailBlob);
  const videoUrl = urlCreator.createObjectURL(videoBlob);

  console.log('Video Blob', videoBlob.size, videoBlob, videoUrl);
  console.log('Thumb Blob', thumbnailBlob, thumbUrl);
  console.log('Started:', startedAt);
  console.log('Duration:', duration);

  return action('onRecordingComplete')(
    videoBlob,
    startedAt,
    thumbnailBlob,
    duration,
  );
};

const actionLoggers = {
  onTurnOnCamera: action('onTurnOnCamera'),
  onTurnOffCamera: action('onTurnOffCamera'),
  onStartRecording: action('onStartRecording'),
  onStopRecording: action('onStopRecording'),
  onRecordingComplete: handleRecordingComplete,
  onOpenVideoInput: action('onOpenVideoInput'),
  onStopReplaying: action('onStopReplaying'),
  onError: action('onError'),
};

export default function CopyBoard() {
  const [useVideoInput, setUseVideoInput] = useState(false);
  // const [isOnInitially, setIsOnInitially] = useState(false);
  return (
    <div>
      <h1>字帖管理</h1>
      {/* {isOnInitially ? 'isOnInitially' : 'not isOnInitially'} */}
      <div
        style={{
          width: 640,
          height: 480,
        }}
      >
        <VideoRecorder
          // isOnInitially={isOnInitially}
          useVideoInput={useVideoInput}
          renderActions={createActions({
            setUseVideoInput,
            // setIsOnInitially
          })}
          renderErrorView={() => (
            <div>
              录制视频失败
              <br />
              <br />请
              <Button
                type="link"
                icon="reload"
                onClick={() => {
                  location.href = location.href;
                }}
              >
                刷新
              </Button>
              后切换到 {useVideoInput ? '录制' : '上传'} 重试 👍
            </div>
          )}
          countdownTime={0 * 1000}
          // timeLimit={5}
          {...actionLoggers}
        />
      </div>
    </div>
  );
}

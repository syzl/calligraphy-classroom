import React, { useState, useRef } from 'react';
import VideoRecorder from 'react-video-recorder';
import { get } from 'lodash';
import createActions from '../../../components/video-record/render-actions';
import { Button, List, Avatar } from 'antd';
import { uploadRaw } from '../../../lib/api';
import { wait } from '../../../lib/utils';
import Button_L from '../../../components/Button_L';

const action = (str = '') => (...args: any[]) =>
  console.info(str, ':', ...args);

const actionLoggers = {
  onTurnOnCamera: action('onTurnOnCamera'),
  onTurnOffCamera: action('onTurnOffCamera'),
  onStartRecording: action('onStartRecording'),
  onStopRecording: action('onStopRecording'),
  onOpenVideoInput: action('onOpenVideoInput'),
  onStopReplaying: action('onStopReplaying'),
  onError: action('onError'),
};

interface VideoItem {
  id: string;
  videoBlob: Blob;
  thumbnailBlob: Blob;
  startedAt: number;
  duration: number;
  thumbUrl: string;
  videoUrl: string;
}

export default function CopyBoard() {
  const [drafts, setDrafts] = useState<VideoItem[]>([]);
  const [useVideoInput, setUseVideoInput] = useState(false);
  const refV = useRef<any>(null);

  const handleRecordingComplete = async (
    videoBlob: Blob,
    startedAt: number,
    thumbnailBlob: Blob,
    duration: number,
  ) => {
    const urlCreator = window.URL || window.webkitURL;
    const thumbUrl = thumbnailBlob && urlCreator.createObjectURL(thumbnailBlob);
    const videoUrl = urlCreator.createObjectURL(videoBlob);

    console.log(' set Video Blob', videoBlob.size, videoBlob, videoUrl);
    console.log('Thumb Blob', thumbnailBlob, thumbUrl);
    console.log('Started:', startedAt);
    console.log('Duration:', duration);
    console.info('refV', refV);
    // 暂停播放
    await wait(100);
    const $video = get(refV, 'current.replayVideo');
    if ($video) {
      $video.pause();
    }
    setDrafts([
      ...drafts,
      {
        id: Math.random()
          .toString(16)
          .slice(2, 8),
        videoBlob,
        thumbnailBlob,
        startedAt,
        duration,
        thumbUrl,
        videoUrl,
      },
    ]);
    return action('onRecordingComplete')(
      videoBlob,
      startedAt,
      thumbnailBlob,
      duration,
    );
  };

  return (
    <div>
      <h1>录制范例</h1>
      <div
        style={{
          width: 640,
          height: 480,
        }}
      >
        <VideoRecorder
          // isOnInitially={isOnInitially}
          ref={refV}
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
          onRecordingComplete={handleRecordingComplete}
        />
      </div>
      <div style={{ marginTop: '2em', width: 640 }}>
        <List
          bordered={true}
          dataSource={drafts}
          renderItem={draft => (
            <List.Item
              actions={[
                <Button
                  type="danger"
                  onClick={() => {
                    setDrafts(drafts.filter(item => item.id !== draft.id));
                  }}
                >
                  丢弃
                </Button>,
                <Button_L
                  type="primary"
                  onClick={async () => {
                    const formdata = new FormData();
                    formdata.append('video', draft.videoBlob, 'tmp.mp4');
                    formdata.append(
                      'thumb',
                      draft.thumbnailBlob,
                      'tmp-thumb.jpg',
                    );
                    formdata.append('startedAt', String(draft.startedAt));
                    formdata.append('duration', String(draft.duration));
                    await uploadRaw(formdata);
                  }}
                  onComplete={() => {
                    setDrafts(drafts.filter(item => item.id !== draft.id));
                  }}
                >
                  上传
                </Button_L>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar shape="square" src={draft.thumbUrl} size={100} />
                }
                title={draft.startedAt}
                description={draft.duration}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

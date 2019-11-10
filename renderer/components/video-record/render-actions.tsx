import React from 'react';
import styled from 'styled-components';
import Button from './button';
import RecordButton from './record-button';
import StopButton from './stop-button';
import Timer from './timer';
import Countdown from './countdown';

const ActionsWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 80px;
`;

const Actions = ({
  isVideoInputSupported,
  isInlineRecordingSupported,
  thereWasAnError,
  isRecording,
  isCameraOn,
  streamIsReady,
  isConnecting,
  isRunningCountdown,
  countdownTime,
  timeLimit,
  isReplayingVideo,
  useVideoInput,

  onTurnOnCamera,
  // onTurnOffCamera,
  onOpenVideoInput,
  onStartRecording,
  onStopRecording,
  onStopReplaying,
}: // onConfirm,
{
  isVideoInputSupported: boolean;
  isInlineRecordingSupported: boolean;
  thereWasAnError: boolean;
  isRecording: boolean;
  isCameraOn: boolean;
  streamIsReady: boolean;
  isConnecting: boolean;
  isRunningCountdown: boolean;
  countdownTime: number;
  timeLimit: number;
  isReplayingVideo: boolean;
  useVideoInput: boolean;

  onTurnOnCamera?: any;
  onTurnOffCamera?: any;
  onOpenVideoInput?: any;
  onStartRecording?: any;
  onStopRecording?: any;
  onStopReplaying?: any;
  onConfirm?: any;
}) => {
  const renderContent = () => {
    const shouldUseVideoInput =
      !isInlineRecordingSupported && isVideoInputSupported;

    if (
      (!isInlineRecordingSupported && !isVideoInputSupported) ||
      thereWasAnError ||
      isConnecting ||
      isRunningCountdown
    ) {
      return null;
    }

    if (isReplayingVideo) {
      return (
        <Button onClick={onStopReplaying} data-qa="start-replaying">
          使用另一个视频
        </Button>
      );
    }

    if (isRecording) {
      return <StopButton onClick={onStopRecording} data-qa="stop-recording" />;
    }

    if (isCameraOn && streamIsReady) {
      return (
        <RecordButton onClick={onStartRecording} data-qa="start-recording" />
      );
    }

    if (useVideoInput) {
      return (
        <Button onClick={onOpenVideoInput} data-qa="open-input">
          上传一个视频
        </Button>
      );
    }

    return shouldUseVideoInput ? (
      <Button onClick={onOpenVideoInput} data-qa="open-input">
        录制一个视频
      </Button>
    ) : (
      <Button onClick={onTurnOnCamera} data-qa="turn-on-camera">
        打开摄像头
      </Button>
    );
  };

  return (
    <div>
      {isRecording && <Timer timeLimit={timeLimit} />}
      {isRunningCountdown && <Countdown countdownTime={countdownTime} />}
      <ActionsWrapper>{renderContent()}</ActionsWrapper>
    </div>
  );
};

export default Actions;

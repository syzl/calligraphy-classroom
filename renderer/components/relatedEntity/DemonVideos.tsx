import React, { useState } from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { API_DEMON_VIDEOS, S_VIDEO_DEMON } from '../../lib/gql';
import { useRouter } from 'next/router';
import {
  Alert,
  Divider,
  Button,
  Tooltip,
  Card,
  Avatar,
  Typography,
  Drawer,
} from 'antd';
import ReactPlayer from 'react-player';

import IconWithLoading from '../IconWithLoading';
import { DemonstrateVideo, PagedResult } from '../../interfaces';
import { SERVER_URL } from '../../lib/constant';
import { videoRelateDemon, copybookRelateVideo } from '../../lib/api';

import CopybookSelector from '../selector/Copybook.selector';
import { Button_ } from '../LoadingWrapper';

export default function RelatedDemonVideos() {
  const [showdrawer, setShowdrawer] = useState(false);
  const [operating, setOperating] = useState(-1);
  const { query } = useRouter();
  const id = +query.id;
  const { loading, error, data, refetch, fetchMore, updateQuery } = useQuery<{
    api_demon_videos: PagedResult<DemonstrateVideo>;
  }>(API_DEMON_VIDEOS, {
    variables: {
      by: id,
    },
  });
  const loadMore = async () => {
    fetchMore({
      variables: {
        page: 1,
      },
      updateQuery(prev, data) {
        console.info('data', data, prev);
        return prev;
      },
    });
  };
  const {
    api_demon_videos: { items = [] },
  } =
    data ||
    ({ api_demon_videos: {} } as {
      api_demon_videos: PagedResult<DemonstrateVideo>;
    });

  // 排序
  //   items.sort((a, b) => (b.demonstrate && !a.demonstrate ? 1 : -1));

  const {
    data: { relation: mutated } = {} as { relation: DemonstrateVideo },
  } = useSubscription<{
    relation: DemonstrateVideo;
  }>(S_VIDEO_DEMON);

  if (mutated) {
    updateQuery(prev => {
      if (!prev) {
        refetch();
        return prev;
      }
      let {
        api_demon_videos: { items: [...newItems] = [] as any } = {} as any,
      } = prev;
      const targetIdx = newItems.findIndex(
        (item: any) => item.id === mutated.id,
      );
      if (targetIdx === -1) {
        // 未找到，刷新items
        newItems.unshift(mutated);
        refetch();
      }
      // else 已存在的，将自动更新缓存

      return prev;
    });
  }

  return (
    <Card
      title="可关联的演示视频"
      size="small"
      loading={loading}
      extra={
        <>
          <Button icon="dash" type="link" onClick={() => loadMore()} />
          <Divider type="vertical" />
          <IconWithLoading type="reload" onClick={() => refetch()} />
        </>
      }
      bodyStyle={{
        padding: '4px 0',
        overflow: 'auto',
      }}
    >
      {error ? <Alert type="error" message={error.message} /> : null}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        {items.map(item => (
          <Card
            style={{
              width: 322,
              margin: 4,
              display: 'flex',
              flexDirection: 'column',
            }}
            key={item.id}
            bodyStyle={{ padding: 4, flex: 1 }}
            cover={
              !(item.video && item.video.raw) ? null : (
                <div
                  style={{
                    width: 320,
                    height: 200,
                  }}
                >
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    light={`${SERVER_URL}/${item.thumb.raw.path.replace(
                      /^_static\//,
                      '',
                    )}`}
                    url={`${SERVER_URL}/${item.video.raw.path.replace(
                      /^_static\//,
                      '',
                    )}`}
                    controls
                  />
                </div>
              )
            }
            actions={[
              <Avatar shape="square" style={{ backgroundColor: '#87d068' }}>
                {item.id}
              </Avatar>,
              <Button
                type="link"
                onClick={() => {
                  setShowdrawer(true);
                  setOperating(item.id);
                }}
                icon="plus"
              >
                字帖
              </Button>,
              <Tooltip title={item.demonstrate ? `取消关联` : '关联当前'}>
                <Button_
                  type={item.demonstrate ? 'danger' : 'primary'}
                  icon={item.demonstrate ? 'disconnect' : 'link'}
                  onClick={() =>
                    videoRelateDemon(item.id, item.demonstrate ? -1 : id)
                  }
                />
              </Tooltip>,
              <Tooltip title="删除 TODO">
                <Button_
                  type="link"
                  icon="delete"
                  style={{ color: 'red' }}
                  onClick={() => {
                    //
                  }}
                />
              </Tooltip>,
            ]}
          >
            <Typography.Text type="secondary">
              {Math.round(item.duration / 1000)} 秒
            </Typography.Text>
            {(item.copybooks || []).length ? (
              <div
                className="border-transparent"
                style={{
                  borderColor: item.id === operating ? 'red' : 'transparent',
                }}
              >
                <h6>相关字帖:</h6>
                {(item.copybooks || []).map(copybook => (
                  <Card.Grid
                    key={copybook.id}
                    style={{
                      padding: 0,
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      height: 90,
                      overflow: 'hidden',
                    }}
                  >
                    {copybook.raw ? (
                      <img
                        style={{ width: '100%', height: 'auto' }}
                        src={`${SERVER_URL}/${copybook.raw.path.replace(
                          /^_static\//,
                          '',
                        )}`}
                      />
                    ) : (
                      '-'
                    )}
                  </Card.Grid>
                ))}
              </div>
            ) : null}
          </Card>
        ))}
      </div>
      <Drawer
        title="选择关联字帖"
        placement="right"
        closable={false}
        onClose={() => {
          setShowdrawer(false);
          setOperating(-1);
        }}
        visible={showdrawer}
      >
        <Typography.Text type="secondary">
          为范字视频 {operating} 添加字帖
        </Typography.Text>

        <p>TODO 选择字帖列表...</p>
        <p>TODO 创建字帖(标记上传文件为字帖)...</p>
        <p>TODO 上传字帖...</p>
        <CopybookSelector
          by={operating}
          onSelect={(copyBookId, videoId) => {
            copybookRelateVideo(copyBookId, videoId).then(data =>
              console.warn('relate video', data),
            );
          }}
        />
      </Drawer>
      <style global jsx>{`
        .border-transparent {
          border: thin solid transparent;
          overflow: hidden;
          padding: 2px;
          border-radius: 3px;
          transition: border 0.5s;
        }
      `}</style>
    </Card>
  );
}

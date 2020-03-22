import React from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { API_DEMON_VIDEOS, S_VIDEO_DEMON } from '../../lib/gql';
import { useRouter } from 'next/router';
import {
  Alert,
  Divider,
  Button,
  Tooltip,
  Avatar,
  Typography,
  List,
  Row,
  Col,
} from 'antd';

import IconWithLoading from '../IconWithLoading';
import { DemonstrateVideo, PagedResult } from '../../interfaces';
import { SERVER_URL } from '../../lib/constant';
import { videoRelateDemon } from '../../lib/api';

import { Button_ } from '../LoadingWrapper';

export default function RelatedDemonVideos() {
  const { query } = useRouter();
  const id = +query.id;
  const { loading, error, data, refetch, fetchMore, updateQuery } = useQuery<{
    pagedItems: PagedResult<DemonstrateVideo>;
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
    pagedItems: { items = [] },
  } =
    data ||
    ({ pagedItems: {} } as {
      pagedItems: PagedResult<DemonstrateVideo>;
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
        pagedItems: { items: [...newItems] = [] as any } = {} as any,
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

  return error ? (
    <Alert type="error" message={error.message} />
  ) : (
    <List
      loading={loading}
      header={
        <Row type="flex">
          <Col>
            <Typography.Text strong>可关联的演示视频</Typography.Text>
          </Col>
          <Col>
            <Button icon="dash" type="link" onClick={() => loadMore()} />
            <Divider type="vertical" />
            <IconWithLoading type="reload" onClick={() => refetch()} />
          </Col>
        </Row>
      }
      bordered
      dataSource={items || []}
      renderItem={item => (
        <List.Item
          actions={[
            item.demonstrate ? (
              <Button type="link" disabled={true}>
                已关联
              </Button>
            ) : (
              <Tooltip title="关联当前">
                <Button_
                  type="link"
                  icon="interaction"
                  onClick={() => videoRelateDemon(item.id, id)}
                >
                  关联
                </Button_>
              </Tooltip>
            ),
          ]}
        >
          <List.Item.Meta
            avatar={
              item.thumb ? (
                <Avatar
                  shape="square"
                  size={48}
                  src={`${SERVER_URL}/${item.thumb.raw.path.replace(
                    /^_static\//,
                    '',
                  )}`}
                />
              ) : (
                <Avatar shape="square" size={48}>
                  -
                </Avatar>
              )
            }
            title={item.char? item.char.replace(/\.mp4$/,'') : item.id}
            description={item.remark || `${item.duration / 1000} s`}
          />
        </List.Item>
      )}
    />
  );
}

// <Drawer
//         title="选择关联字帖"
//         placement="right"
//         closable={false}
//         onClose={() => {
//           setShowdrawer(false);
//           setOperating(-1);
//         }}
//         visible={showdrawer}
//       >
//         <Typography.Text type="secondary">
//           为范字视频 {operating} 添加字帖
//         </Typography.Text>

//         <p>TODO 选择字帖列表...</p>
//         <p>TODO 创建字帖(标记上传文件为字帖)...</p>
//         <p>TODO 上传字帖...</p>
//         <CopybookSelector
//           by={operating}
//           onSelect={(copyBookId, videoId) => {
//             copybookRelateVideo(copyBookId, videoId).then(data =>
//               console.warn('relate video', data),
//             );
//           }}
//         />
//       </Drawer>
//       <style global jsx>{`
//         .border-transparent {
//           border: thin solid transparent;
//           overflow: hidden;
//           padding: 2px;
//           border-radius: 3px;
//           transition: border 0.5s;
//         }
//       `}</style>
// <Button
// type="link"
// onClick={() => {
//   setShowdrawer(true);
//   setOperating(item.id);
// }}
// icon="plus"
// >
// 字帖
// </Button>
// {(item.copybooks || []).length ? (
// <div
//   className="border-transparent"
//   style={{
//     borderColor:
//       item.id === operating ? 'red' : 'transparent',
//   }}
// >
//   <h6>相关字帖:</h6>
//   {(item.copybooks || []).map(copybook => (
//     <div
//       key={copybook.id}
//       style={{
//         padding: 0,
//         border: 'none',
//         display: 'flex',
//         alignItems: 'center',
//         height: 90,
//         overflow: 'hidden',
//       }}
//     >
//       {copybook.raw ? (
//         <img
//           style={{ width: '100%', height: 'auto' }}
//           src={`${SERVER_URL}/${copybook.raw.path.replace(
//             /^_static\//,
//             '',
//           )}`}
//         />
//       ) : (
//         '-'
//       )}
//     </div>
//   ))}
// </div>
// ) : null}

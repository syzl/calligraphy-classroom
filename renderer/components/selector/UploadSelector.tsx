import React, { useState, FunctionComponent, useEffect } from 'react';
import { Button, Modal, Alert, Spin } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import InfiniteScroll from 'react-infinite-scroller';

import { API_UPLOAD_RAWS } from '../../lib/gql';
import { PagedResult, Upload } from '../../interfaces';
import { wait } from '../../lib/utils';

// TODO 优化，移除 actions 互传

interface Props {
  by?: number | string;
  mark?: (p: any) => unknown;
  selector?: FunctionComponent<{ open?: Function }>;
  onSelected?: (selectedId: string | number, refetch: Function) => void;
}

export default function UploadSelector({
  mark,
  by,
  selector,
  onSelected,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [completing, setCompleting] = useState(false);
  const { data, loading, error, fetchMore, refetch } = useQuery<{
    api_upload_raws: PagedResult<Upload>;
  }>(API_UPLOAD_RAWS, { variables: { page: 1, limit: 10, by } });
  useEffect(() => {
    mark && mark(() => refetch);
  }, []);
  const { items = [] as Upload[], next, totalItems } =
    (data && data.api_upload_raws) || ({} as PagedResult<Upload>);
  const Component =
    selector ||
    (({ open }) => (
      <Button onClick={() => open && open()} type="primary">
        选择
      </Button>
    ));
  return (
    <>
      <Component open={() => setVisible(true)} />
      <Modal
        title={
          <span onClick={() => refetch()}>{`选择资源 ${totalItems}个`}</span>
        }
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Spin spinning={loading || completing}>
          {error ? (
            <Alert
              message={error.message}
              description={error.stack}
              type="error"
              closable
            />
          ) : null}
          <div className="infinite-container">
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={() => {
                fetchMore({
                  variables: {
                    page: (items.length % 10) + 2,
                  },
                  updateQuery(prev, { fetchMoreResult }) {
                    if (!fetchMoreResult) return prev;
                    return Object.assign({}, prev, {
                      api_upload_raws: {
                        ...fetchMoreResult.api_upload_raws,
                        items: [
                          ...prev.api_upload_raws.items,
                          ...fetchMoreResult.api_upload_raws.items,
                        ],
                      },
                    });
                  },
                });
              }}
              hasMore={!loading && !!next}
              useWindow={false}
            >
              {items.map((item, idx) => (
                <div key={idx} style={{ lineHeight: '2em' }}>
                  <Button
                    disabled={!!item.video}
                    type="link"
                    onClick={async () => {
                      setCompleting(true);
                      await (onSelected && onSelected(item.id, refetch));
                      setCompleting(false);
                      await wait(20);
                      setVisible(false);
                    }}
                  >
                    {`${item.id}. ${item.mimetype.split('/')[0]} ${
                      item.originalname
                    } ${item.path}`}
                  </Button>
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </Spin>
      </Modal>
      <style jsx>{`
        .infinite-container {
          overflow: auto;
          height: 300px;
        }
      `}</style>
    </>
  );
}

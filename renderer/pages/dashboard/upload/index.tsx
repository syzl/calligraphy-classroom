import React, { useState } from 'react';
import {
  Button,
  message,
  Icon,
  Divider,
  Table,
  Drawer,
  Row,
  Col,
  Typography,
  Popover,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as _ from 'lodash';
import { withApollo } from '../../../lib/apollo';
import * as GQL from '../../../lib/gql';
import { wait, getDepCache } from '../../../lib/utils';
import { Upload, PagedResult } from '../../../interfaces';
import CreateUploadRaw from '../../../components/forms/UploadRaw';
import { SERVER_URL } from '../../../lib/constant';

const Uploads: NextPage = function() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { push } = useRouter();
  const [refetching, setRefetching] = useState(false);
  const { loading, error, data, refetch, updateQuery } = useQuery<{
    api_upload_raws: PagedResult<Upload>;
  }>(GQL.API_UPLOAD_RAWS, {
    variables: {
      limit,
      page,
    },
  });
  const refetchWithMarking = async () => {
    if (refetching) return;
    setRefetching(true);
    await Promise.all([wait(1000), refetch()]);
    setRefetching(false);
  };
  const [deleteUploadRaw, { loading: deleting }] = useMutation<{
    deleteUploadRaw: Upload;
  }>(GQL.DELETE_UPLOAD_RAW, {
    update(proxy, { data }) {
      if (!data) {
        return proxy;
      }
      const { deleteUploadRaw } = data;

      if (deleteUploadRaw) {
        // 优化内存占用, 效果不大, 无法撤销
        const cache = getDepCache(proxy);
        cache.delete(`Upload：${deleteUploadRaw.id}`);
        updateQuery(prev => {
          const {
            api_upload_raws: { ...api_upload_raws },
          } = prev;
          const idx = api_upload_raws.items.findIndex(
            item => item.id === deleteUploadRaw.id,
          );
          if (idx > -1) {
            api_upload_raws.items.splice(idx, 1);
            api_upload_raws.totalItems -= 1;
            return { ...prev, api_upload_raws };
          }
          return prev;
        });
      }
    },
  });

  const columns: ColumnProps<Upload>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: '名称',
      dataIndex: 'originalname',
      key: 'originalname',
    },
    {
      title: 'mime',
      dataIndex: 'mimetype',
      key: 'mimetype',
      render(mime, record) {
        if (mime.startsWith('image/')) {
          return (
            <Popover
              trigger="click"
              placement="bottom"
              content={
                <img
                  style={{ width: 240 }}
                  alt={record.originalname}
                  src={`${SERVER_URL}/${record.path.replace(
                    /^_static\/?/,
                    '',
                  )}`}
                />
              }
            >
              <Button type="link" icon="eye">
                图片
              </Button>
            </Popover>
          );
        }
        return mime;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_: any, record: any) => (
        <span>
          <Button
            type="link"
            onClick={() => {
              window.open(
                `${SERVER_URL}${record.path.replace(/^_static/, '')}`,
                '_blank',
              );
            }}
          >
            下载
          </Button>
          <Divider type="vertical" />
          <Popover
            trigger="click"
            placement="left"
            content={
              <Button
                type="danger"
                icon="delete"
                loading={deleting}
                onClick={() => {
                  deleteUploadRaw({ variables: { id: record.id } });
                }}
              >
                确定删除
              </Button>
            }
          >
            <Icon type="delete" />
          </Popover>
        </span>
      ),
    },
  ];

  if (error) {
    message.error(error.message);
  }
  const { items: uploads, totalItems } =
    (data && data.api_upload_raws) || ({} as PagedResult<Upload>);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row type="flex" style={{ flex: '0 0 auto' }}>
        <Col style={{ flex: 1 }}>
          <Typography.Title level={3}>上传内容管理</Typography.Title>
        </Col>
        <Col>
          <Icon
            style={{ padding: 5 }}
            type="reload"
            spin={refetching}
            onClick={refetchWithMarking}
          />
          <Divider type="vertical" />
          <Button
            shape="round"
            onClick={() => {
              push('/dashboard/course/add');
            }}
          >
            添加
          </Button>
          <Divider type="vertical" />
          <Button
            icon="plus"
            type="primary"
            shape="circle"
            onClick={() => setShowDrawer(true)}
          />
        </Col>
      </Row>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          size="small"
          loading={loading || refetching}
          rowKey="id"
          columns={columns}
          dataSource={uploads}
          // scroll={{ y: 360 }}
          pagination={{
            size: 'small',
            total: totalItems,
            pageSize: limit,
            current: page,
            showSizeChanger: true,
            pageSizeOptions: ['6', '10', '30', '50'],
            onChange(page, pageSize) {
              setPage(page);
              pageSize && setLimit(pageSize);
            },
            onShowSizeChange(current, size) {
              setPage(current);
              setLimit(size);
            },
          }}
        />
      </div>
      <Drawer
        width="360"
        title="上传"
        placement="right"
        closable={false}
        onClose={() => {
          setShowDrawer(false);
        }}
        visible={showDrawer}
      >
        <CreateUploadRaw
          onCompleted={() => {
            refetchWithMarking();
          }}
        />
      </Drawer>
    </div>
  );
};
export default withApollo(Uploads);

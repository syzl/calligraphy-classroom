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
  Tooltip,
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
  const [deleteUpload, { loading: deleting }] = useMutation<{
    deleteUpload: Upload | null;
  }>(GQL.DELETE_UPLOAD_RAW, {
    update(proxy, { data: { deleteUpload } }) {
      if (deleteUpload) {
        // 优化内存占用, 效果不大, 无法撤销
        const cache = getDepCache(proxy);
        cache.delete(`Upload：${deleteUpload.id}`);
        updateQuery(prev => {
          const {
            api_upload_raws: { ...api_upload_raws },
          } = prev;
          const idx = api_upload_raws.items.findIndex(
            item => item.id === deleteUpload.id,
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
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '详情',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_: any, record: any) => (
        <span>
          <Button type="link">学习演示</Button>
          <Divider type="vertical" />
          <Tooltip
            trigger="click"
            placement="left"
            title={
              <Button
                type="danger"
                icon="delete"
                loading={deleting}
                onClick={() => {
                  deleteUpload({ variables: { id: record.id } });
                }}
              >
                确定删除
              </Button>
            }
          >
            <Icon type="delete" />
          </Tooltip>
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
          <Typography.Title level={3}>范字演示管理</Typography.Title>
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

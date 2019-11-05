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
import { Demonstrate, PagedResult } from '../../../interfaces';
import CreateDemonstrate from '../../../components/forms/Demonstrate';

const Demonstrates: NextPage = function() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { push } = useRouter();
  const [refetching, setRefetching] = useState(false);
  const { loading, error, data, refetch, updateQuery } = useQuery<{
    api_demonstrates: PagedResult<Demonstrate>;
  }>(GQL.API_DEMOSTRATES, {
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
  const [deleteDemonstrate, { loading: deleting }] = useMutation<{
    deleteDemonstrate: Demonstrate | null;
  }>(GQL.DELETE_DEMOSTRATE, {
    update(proxy, { data: { deleteDemonstrate } }) {
      if (deleteDemonstrate) {
        // 优化内存占用, 效果不大, 无法撤销
        const cache = getDepCache(proxy);
        cache.delete(`Demonstrate：${deleteDemonstrate.id}`);
        updateQuery(prev => {
          const {
            api_demonstrates: { ...api_demonstrates },
          } = prev;
          const idx = api_demonstrates.items.findIndex(
            item => item.id === deleteDemonstrate.id,
          );
          if (idx > -1) {
            api_demonstrates.items.splice(idx, 1);
            api_demonstrates.totalItems -= 1;
            return { ...prev, api_demonstrates };
          }
          return prev;
        });
      }
    },
  });

  const columns: ColumnProps<Demonstrate>[] = [
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
                  deleteDemonstrate({ variables: { id: record.id } });
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
  const { items: demonstrates, totalItems } =
    (data && data.api_demonstrates) || ({} as PagedResult<Demonstrate>);

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
          dataSource={demonstrates}
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
        title="范字演示"
        placement="right"
        closable={false}
        onClose={() => {
          setShowDrawer(false);
        }}
        visible={showDrawer}
      >
        <CreateDemonstrate
          onCompleted={() => {
            refetchWithMarking();
          }}
        />
      </Drawer>
    </div>
  );
};
export default withApollo(Demonstrates, { ssr: false });

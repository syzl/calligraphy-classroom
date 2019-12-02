import React, { useState } from 'react';
import {
  Button,
  Icon,
  Divider,
  Drawer,
  Row,
  Col,
  Typography,
  Popover,
  List,
  Avatar,
  Spin,
  Card,
  Alert,
} from 'antd';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as _ from 'lodash';
import { withApollo } from '../../../lib/apollo';
import { Upload } from '../../../interfaces';
import CreateUploadRaw from '../../../components/forms/UploadRaw';
import { SERVER_URL } from '../../../lib/constant';
import { traceUpload } from '../../../lib/api';

import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroller';
import { holderCardProp } from '../../../lib/common';
import { QueryListWithDelWrapper } from '../../../components/gql/QueryListWrapper';
import { API_UPLOAD_RAWS, DELETE_UPLOAD_RAW } from '../../../lib/gql';
import IconWithLoading from '../../../components/IconWithLoading';
import { Button_ } from '../../../components/LoadingWrapper';

const Uploads: NextPage = function() {
  const [showDrawer, setShowDrawer] = useState(false);
  const { push } = useRouter();

  return (
    <QueryListWithDelWrapper<Upload, 'api_upload_raws', 'deleteUploadRaw'>
      gql={API_UPLOAD_RAWS}
      deleteGql={DELETE_UPLOAD_RAW}
      dataKey="api_upload_raws"
      delDataKey="deleteUploadRaw"
      variables={{ limit: 8, page: 1 }}
      render={({
        origin: { loading, error, refetch },
        hasNext,
        dataItems,
        setFetchMorePage,
        loadMore,
        delFn,
      }) => {
        return (
          <Card
            {...holderCardProp}
            title={<Typography.Title level={4}>上传内容管理</Typography.Title>}
            extra={
              <Row type="flex">
                <Col style={{ flex: 1 }}></Col>
                <Col style={{ paddingTop: 5 }}></Col>
                <Col>
                  <IconWithLoading
                    style={{ padding: 5 }}
                    type="reload"
                    onClick={() => {
                      setFetchMorePage(1);
                      refetch();
                    }}
                  />
                  <Divider type="vertical" />

                  <Button
                    icon="plus"
                    type="primary"
                    shape="circle"
                    onClick={() => setShowDrawer(true)}
                  />
                </Col>
              </Row>
            }
          >
            {error ? <Alert type="error" message={error.message} /> : null}
            <div style={{ flex: '1 1 400px', overflow: 'auto' }}>
              <InfiniteScroll
                initialLoad={true}
                loadMore={() => loadMore()}
                hasMore={!!hasNext && !loading}
                useWindow={false}
              >
                <List
                  dataSource={dataItems}
                  renderItem={item => (
                    <List.Item
                      key={item.id}
                      actions={[
                        <Button_
                          type="link"
                          onClick={() => traceUpload('copybook', item.id)}
                        >
                          标记为copybook
                        </Button_>,
                        <Button
                          type="link"
                          onClick={() => {
                            window.open(
                              `${SERVER_URL}${item.path.replace(
                                /^_static/,
                                '',
                              )}`,
                              '_blank',
                            );
                          }}
                        >
                          下载
                        </Button>,
                        <Button
                          type="link"
                          onClick={() => {
                            push(
                              '/dashboard/upload/[id]',
                              `/dashboard/upload/${item.id}`,
                            );
                          }}
                        >
                          详情
                        </Button>,
                        delFn ? (
                          <Popover
                            trigger="click"
                            placement="left"
                            content={
                              <Button_
                                type="danger"
                                icon="delete"
                                onClick={() =>
                                  delFn({ variables: { id: item.id } })
                                }
                              >
                                确定删除
                              </Button_>
                            }
                          >
                            <Icon type="delete" />
                          </Popover>
                        ) : null,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Link
                            href="/dashboard/demonstrate/[id]"
                            as={`/dashboard/demonstrate/${item.id}`}
                          >
                            <Avatar
                              {...(item.mimetype.startsWith('image/')
                                ? {
                                    src: `${SERVER_URL}/${item.path.replace(
                                      /^_static\/?/,
                                      '',
                                    )}`,
                                  }
                                : { icon: 'question' })}
                              style={{ cursor: 'pointer' }}
                              size={64}
                              shape="square"
                            />
                          </Link>
                        }
                        title={
                          <Link
                            href="/dashboard/demonstrate/[id]"
                            as={`/dashboard/demonstrate/${item.id}`}
                          >
                            <a>{item.originalname}</a>
                          </Link>
                        }
                        description={
                          <span>
                            [id:{item.id}] [size:{Math.round(item.size / 1024)}
                            K]
                            {item.path}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                >
                  {loading && !!hasNext && (
                    <div className="demo-loading-container">
                      <Spin />
                    </div>
                  )}
                </List>
              </InfiniteScroll>
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
              <CreateUploadRaw onCompleted={() => refetch()} />
            </Drawer>
          </Card>
        );
      }}
    />
  );
};
export default withApollo(Uploads);

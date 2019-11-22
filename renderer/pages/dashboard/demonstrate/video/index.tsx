import React from 'react';
import { Button, List, Avatar, Divider } from 'antd';
import { EntityListPage } from '../../../../components/page/list';
import { API_DEMON_VIDEOS } from '../../../../lib/gql';
import { Icon_ } from '../../../../components/LoadingWrapper';
import { DemonstrateVideo } from '../../../../interfaces';
import Link from 'next/link';
import { withApollo } from '../../../../lib/apollo';

export default withApollo(function DemonVideoList() {
  return (
    <EntityListPage<any, DemonstrateVideo>
      title="演示视频"
      datalist={{
        query: API_DEMON_VIDEOS,
        vars: { limit: 10, page: 1 },
      }}
      extra={({ setFetchMorePage, refetch, setShowDrawer }) => (
        <>
          <Icon_
            style={{ padding: 5 }}
            type="reload"
            onClick={async () => {
              setFetchMorePage(1);
              await refetch();
            }}
          />
          <Divider type="vertical" />
          <Button
            icon="plus"
            type="primary"
            shape="circle"
            onClick={() => {
              setShowDrawer(true);
            }}
          />
        </>
      )}
      enableFetchmore={true}
      renderList={dataItems => (
        <List
          dataSource={dataItems}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Link
                    href="/dashboard/demonstrate/video/[id]"
                    as={`/dashboard/demonstrate/video/${item.id}`}
                  >
                    <Avatar style={{ cursor: 'pointer' }} size={48}>
                      {item.id}
                    </Avatar>
                  </Link>
                }
                title={
                  <Link
                    href="/dashboard/demonstrate/video/[id]"
                    as={`/dashboard/demonstrate/video/${item.id}`}
                  >
                    <a>{item.duration}</a>
                  </Link>
                }
                description={item.createdAt}
              />
            </List.Item>
          )}
        />
      )}
      drawerProps={{ title: '创建 Demonstrate Video', closable: true }}
    />
  );
});

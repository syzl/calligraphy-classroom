import React, { FunctionComponent } from 'react';
import { Layout, Menu, Icon, Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import { ClickParam } from 'antd/lib/menu';
import Link from 'next/link';

const { Content, Sider } = Layout;

const CaLayout: FunctionComponent<any> = function({ children }) {
  const { push, pathname } = useRouter();
  const handleClick = (e: ClickParam) => {
    if (e.key.startsWith('/dashboard')) {
      push(e.key);
    }
  };
  const defaultSelectedKeys = [pathname];
  return (
    <Layout style={{ height: '100%' }}>
      <Content
        style={{ padding: '0 50px', display: 'flex', flexDirection: 'column' }}
      >
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>
            <Link href="/">
              <a>首页</a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/dashboard">
              <a>控制面板</a>
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{
            padding: '24px 0',
            background: '#fff',
            flex: 1,
            overflow: 'hidden',
            flexDirection: 'row',
          }}
        >
          <Sider width={200} style={{ background: '#fff', overflow: 'auto' }}>
            <Menu
              onClick={handleClick}
              mode="inline"
              defaultSelectedKeys={defaultSelectedKeys}
              defaultOpenKeys={['sub1', 'sub2', 'sub3']}
              style={{ height: '100%' }}
            >
              <Menu.Item key="/dashboard">
                <Icon type="home" />
                管理
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="/dashboard/course">
                <Icon type="laptop" />
                课程
              </Menu.Item>
              <Menu.Item key="/dashboard/demonstrate">
                <Icon type="user" />
                演示
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="/dashboard/upload">
                <Icon type="notification" />
                已上传文件
              </Menu.Item>
              <Menu.Item key="/dashboard/record">
                <Icon type="notification" />
                随堂录制
              </Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Content>
      <Layout.Footer style={{ textAlign: 'center' }}>©2019</Layout.Footer>
      <style>{`
        .logo {
          width: 120px;
          height: 31px;
          background: rgba(255, 255, 255, 0.2);
          margin: 16px 28px 16px 0;
          float: left;
        }
      `}</style>
    </Layout>
  );
};

export default CaLayout;

import React, { FunctionComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { useRouter } from 'next/router';
import { ClickParam } from 'antd/lib/menu';

const { Content, Sider } = Layout;

const CaLayout: FunctionComponent<any> = function({ children }) {
  const { push, pathname } = useRouter();
  const handleClick = (e: ClickParam) => {
    if (e.key === '/' || e.key.startsWith('/dashboard')) {
      push(e.key);
    }
  };
  const defaultSelectedKeys = [pathname];
  return (
    <Layout style={{ height: '100%' }}>
      <Content style={{ display: 'flex', flexDirection: 'column' }}>
        <Layout
          style={{
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
              defaultOpenKeys={['sub1', 'sub1-1', 'sub3']}
              style={{ height: '100%' }}
            >
              <Menu.Item key="/">
                <Icon type="home" />
                返回
              </Menu.Item>
              <Menu.Item key="/dashboard">
                <Icon type="home" />
                管理
              </Menu.Item>
              <Menu.Divider />
              <Menu.SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="laptop" />
                    <span>课程</span>
                  </span>
                }
              >
                <Menu.Item key="/dashboard/course">
                  <Icon type="laptop" />
                  列表
                </Menu.Item>
                <Menu.SubMenu
                  key="sub1-1"
                  title={
                    <span>
                      <Icon type="laptop" />
                      <span> 演示</span>
                    </span>
                  }
                >
                  <Menu.Item key="/dashboard/demonstrate">
                    <Icon type="user" />
                    列表
                  </Menu.Item>
                </Menu.SubMenu>
              </Menu.SubMenu>
              <Menu.Item key="/dashboard/demonstrate/video">
                <Icon type="user" />
                范字视频
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
          <Content style={{ minHeight: 280 }}>{children}</Content>
        </Layout>
      </Content>
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

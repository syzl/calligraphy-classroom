import React, { FunctionComponent } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { useRouter } from 'next/router';
import { ClickParam } from 'antd/lib/menu';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const CaLayout: FunctionComponent<any> = function({ children }) {
  const { push, pathname } = useRouter();
  const handleClick = (e: ClickParam) => {
    if (e.key.startsWith('/dashboard')) {
      push(e.key);
    }
  };
  const topMenuClick = (e: ClickParam) => {
    if (e.key.startsWith('/dashboard')) {
      if (!pathname.startsWith(e.key)) {
        push(e.key);
      }
    }
  };
  const defaultSelectedKeys = [pathname];
  return (
    <Layout style={{ height: '100%' }}>
      <Header className="header">
        <div className="logo" onClick={() => push('/')} />
        <Menu
          onClick={topMenuClick}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="/dashboard">管理面板</Menu.Item>
          <Menu.Item key="2">学生管理</Menu.Item>
          <Menu.Item key="3">作业管理</Menu.Item>
          <Menu.Item key="4">公共课堂</Menu.Item>
        </Menu>
      </Header>
      <Content
        style={{ padding: '0 50px', display: 'flex', flexDirection: 'column' }}
      >
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>书法学习</Breadcrumb.Item>
          <Breadcrumb.Item>课堂列表</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{
            padding: '24px 0',
            background: '#fff',
            flex: 1,
            overflow: 'hidden',
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
              <Menu.Item key="/dashboard">管理</Menu.Item>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    演示
                  </span>
                }
              >
                <Menu.Item key="/dashboard/demonstrate">列表</Menu.Item>
                <Menu.Item key="/dashboard/demonstrate/add">添加</Menu.Item>
                <Menu.Item key="3">关联作业｜ 关联范字</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="laptop" />
                    课程管理
                  </span>
                }
              >
                <Menu.Item key="/dashboard/course">列表</Menu.Item>
                <Menu.Item key="/dashboard/course/add">添加</Menu.Item>
                <Menu.Item key="5">硬笔课程</Menu.Item>
                <Menu.Item key="6">毛笔课程</Menu.Item>
                <Menu.Item key="7">义务教育课程</Menu.Item>
                <Menu.Item key="8">自选课程</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <Icon type="notification" />
                    更多
                  </span>
                }
              >
                <Menu.Item key="/dashboard/copy-board">字帖管理</Menu.Item>
                <Menu.Item key="12">随堂范字录制管理</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>©2019</Footer>
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

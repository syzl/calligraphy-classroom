import * as React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Card } from 'antd';

const IndexPage: NextPage = () => {
  const links = [
    { href: '/login', label: '登陆' },
    { href: '/register', label: '注册' },
    { href: '/', label: '/' },
    { href: '/', label: '/' },
    { href: '/dashboard/course', label: '课程' },
    { href: '/dashboard/demonstrate', label: '范字演示' },
    { href: '/dashboard/record', label: '录制' },
  ];
  return (
    <Card title={<div style={{ textAlign: 'center' }}>功能导航</div>}>
      {links.map((item, idx) => (
        <Card.Grid key={idx} className="nav-grid">
          <Link href={item.href}>
            <div className="inner">
              <a>{item.label}</a>
            </div>
          </Link>
        </Card.Grid>
      ))}

      <style global jsx>{`
        .nav-grid {
          width: 25%;
          text-align: center;
          padding: 0;
          height: 4em;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
      <style jsx lang="less">{`
        .inner {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          cursor: pointer;
        }
      `}</style>
    </Card>
  );
};

export default IndexPage;

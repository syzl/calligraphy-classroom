import * as React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Card } from 'antd';

const IndexPage: NextPage = () => {
  return (
    <Card title={<div style={{ textAlign: 'center' }}>功能导航</div>}>
      <Card.Grid hoverable={false} className="nav-grid">
        <Link href="/dashboard/course">
          <div className="inner">
            <a>课程</a>
          </div>
        </Link>
      </Card.Grid>
      <Card.Grid className="nav-grid">
        <Link href="/dashboard/demonstrate">
          <div className="inner">
            <a>范字演示</a>
          </div>
        </Link>
      </Card.Grid>
      <Card.Grid className="nav-grid">Content</Card.Grid>
      <Card.Grid className="nav-grid">Content</Card.Grid>
      <Card.Grid className="nav-grid">Content</Card.Grid>
      <Card.Grid className="nav-grid">Content</Card.Grid>
      <Card.Grid className="nav-grid">Content</Card.Grid>
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

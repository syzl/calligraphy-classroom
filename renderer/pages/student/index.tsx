import React from 'react';
import { Divider, Row, Col, Card, Typography } from 'antd';
import Link from 'next/link';

export default function StudentView() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card style={{ minWidth: 540, minHeight: 300 }} title="学习">
        <Row type="flex">
          <Col style={{ flex: 1 }}>
            <Typography.Title level={4}>选择课堂[TODO]</Typography.Title>
            <Divider />
          </Col>

          <Col style={{ flex: 1 }}>
            <Typography.Title underline level={4}>
              <Link href="/student/course">
                <a>选择课程</a>
              </Link>
            </Typography.Title>
            <Divider />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

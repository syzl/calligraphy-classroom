import React from 'react';
import { Divider, Row, Col, Card, Typography } from 'antd';

export default function StudentCourseView() {
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
            <Typography.Title level={4}>选择课程</Typography.Title>
            <Divider />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

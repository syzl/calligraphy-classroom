import React from 'react';
import { Card, Row, Col } from 'antd';

export default function DemonVideoList() {
    
  return (
    <Card
      bordered={false}
      title="演示视频"
      extra={
        <Row type="flex">
          <Col>刷新</Col>
          <Col>关联演示</Col>
          <Col>关联的字帖</Col>
        </Row>
      }
    >

    </Card>
  );
}

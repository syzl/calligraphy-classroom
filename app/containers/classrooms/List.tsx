import React from 'react';
import { Table, Typography } from 'antd';
import CaLayout from '../../components/CaLayout';

const columns = [
  { title: '课堂名称', dataIndex: 'name', key: 'name' },
  { title: '人数', dataIndex: 'age', key: 'age' },
  { title: '范字', dataIndex: 'chars', key: 'chars' },
  { title: '-', dataIndex: 'type', key: 'type' },
  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    render: () => <a>进入课堂</a>
  }
];

const data = [
  {
    key: 1,
    name: '公共课堂',
    age: 32,
    chars: '公共自习',
    type: '',
    description: '课堂老师: 老师A'
  },
  {
    key: 2,
    name: '三年级一课，5班',
    age: 42,
    chars: '随课课程',
    type: '硬笔',

    description: '课堂老师: 老师A'
  },
  {
    key: 3,
    name: '魏碑',
    age: 32,
    chars: '自选课程',
    type: '毛笔',
    description: '课堂老师: 老师A'
  }
];
export default function ClassroomsPage() {
  return (
    <CaLayout>
      <Typography.Title>课堂列表</Typography.Title>
      <Table
        columns={columns}
        expandedRowRender={record => (
          <p style={{ margin: 0 }}>{record.description}</p>
        )}
        dataSource={data}
      />
    </CaLayout>
  );
}

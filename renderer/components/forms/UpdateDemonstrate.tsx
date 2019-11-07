import React, { useState } from 'react';
import {
  Form,
  Input,
  Spin,
  Row,
  Col,
  Divider,
  List,
  Button,
  Avatar,
} from 'antd';
import { useMutation } from '@apollo/react-hooks';
import * as GQL from '../../lib/gql';
import { Demonstrate, DemonstrateVideo } from '../../interfaces';

import { formItemLayout } from './constant';
import { SERVER_URL } from '../../lib/constant';
import UploadSelector from '../selector/UploadSelector';
import { deleteVideoRelation } from '../../lib/api';

const fields: (keyof (Omit<Demonstrate, 'videos' | 'id'>))[] = [
  'title',
  'desc',
  'type',
  'subType',
];
const labels = ['名称', '描述', '类型', '子类型'];
const components = [, Input.TextArea];
const componentProps = [, { autoSize: { minRows: 2, maxRows: 6 } }];

export default function UpdateDemonstrate({
  data,
  onDeleteVideo,
}: //   onCompleted,
//   clearCache = true,
{
  data: Demonstrate;
  onDeleteVideo?: (id: number | string) => void;
  //   clearCache?: Boolean;
  //   onCompleted?: Function;
}) {
  const videos = data.videos || ([] as DemonstrateVideo[]);
  const [relateId, setRelateId] = useState('');
  const formItems = fields.map((field, idx) => {
    const [loading, setloading] = useState(false);
    const [state, setstate] = useState(data[field] || '');
    return {
      state,
      loading,
      setloading,
      setstate,
      field,
      label: labels[idx],
      C: components[idx] || Input,
      props: componentProps[idx],
    };
  });

  const [updateRecord] = useMutation<
    { updateDemonstrate: Demonstrate },
    { id: number; input: any }
  >(GQL.UPDATE_DEMOSTRATE);

  return (
    <div>
      <Form {...formItemLayout}>
        {formItems.map(
          ({
            field,
            state,
            setstate,
            loading,
            setloading,
            label,
            C,
            props,
          }) => (
            <Spin key={field} spinning={loading}>
              <Form.Item label={label}>
                <C
                  {...props}
                  name={field}
                  value={state}
                  placeholder={label}
                  onChange={(
                    e:
                      | React.ChangeEvent<HTMLInputElement>
                      | React.ChangeEvent<HTMLTextAreaElement>,
                  ) => setstate(e.target.value)}
                  onBlur={async () => {
                    setloading(true);
                    await updateRecord({
                      variables: { id: data.id, input: { [field]: state } },
                    });
                    setloading(false);
                  }}
                />
              </Form.Item>
            </Spin>
          ),
        )}
      </Form>
      <Divider />
      <Row></Row>
      <Row type="flex">
        <Col style={{ flex: 1 }}>
          <Row>
            <UploadSelector
              selector={({ open }) => (
                <Input.Search
                  placeholder="选中资源已关联"
                  onSearch={() => open && open()}
                  enterButton="选择资源"
                  value={relateId}
                />
              )}
              onSelected={async (selectedId, refetch) => {
                setRelateId(`${selectedId}`);
                await updateRecord({
                  variables: {
                    id: data.id,
                    input: {
                      videos: [{ upload: { id: +selectedId } }],
                    },
                  },
                });
                await refetch();
              }}
            />
          </Row>
          <Divider>已关联视频</Divider>
          <List
            dataSource={videos}
            renderItem={({
              id: videoId,
              upload: { originalname, path, mimetype = '' },
            }) => (
              <List.Item
                actions={[
                  <a key="list-loadmore-edit">edit</a>,
                  <Button
                    icon="delete"
                    type="link"
                    style={{ color: 'red' }}
                    onClick={async () => {
                      await deleteVideoRelation(videoId);
                      onDeleteVideo && onDeleteVideo(videoId);
                    }}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={originalname}
                  avatar={
                    mimetype.startsWith('image/') ? (
                      <Avatar
                        shape="square"
                        size={64}
                        src={`${SERVER_URL}/${path.replace(/^_static\/?/, '')}`}
                      />
                    ) : null
                  }
                />
              </List.Item>
            )}
          />
        </Col>
        <Col style={{ flex: 1 }}></Col>
      </Row>
    </div>
  );
}

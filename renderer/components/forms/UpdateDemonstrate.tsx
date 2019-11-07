import React, { useState } from 'react';
import {
  Form,
  Input,
  Spin,
  Row,
  Icon,
  Button,
  Collapse,
  Col,
  Divider,
} from 'antd';
import { useMutation } from '@apollo/react-hooks';
import * as GQL from '../../lib/gql';
import { Demonstrate, DemonstrateVideo } from '../../interfaces';

import { formItemLayout } from './constant';
import { SERVER_URL } from '../../lib/constant';
import UploadSelector from '../selector/UploadSelector';

const { Panel } = Collapse;

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
}: //   onCompleted,
//   clearCache = true,
{
  data: Demonstrate;
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
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => (
              <Icon type="caret-right" rotate={isActive ? 90 : 0} />
            )}
          >
            {videos.map(
              ({ upload: { id, originalname, path, mimetype = '' } }) => (
                <Panel
                  key={id}
                  header={`${id} [${mimetype.split('/')[0]}] ${originalname}`}
                  className="video-item"
                  extra={
                    <>
                      <Button
                        onClick={() => {
                          const href = `${SERVER_URL}/${path.replace(
                            /^_static\/?/,
                            '',
                          )}`;
                          window.open(href, '_blank');
                        }}
                        type="link"
                        icon="monitor"
                      />
                      <Button
                        type="link"
                        icon="delete"
                        style={{ color: 'red' }}
                        onClick={event => {
                          // If you don't want click extra trigger collapse, you can prevent this:
                          event.stopPropagation();
                        }}
                      />
                    </>
                  }
                >
                  <div></div>
                </Panel>
              ),
            )}
          </Collapse>
        </Col>
        <Col style={{ flex: 1 }}></Col>
      </Row>
    </div>
  );
}

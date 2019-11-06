import React, { useState } from 'react';
import { Form, Input, Spin } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import * as GQL from '../../lib/gql';
import { Demonstrate } from '../../interfaces';

import { formItemLayout } from './constant';

const fields: (keyof Demonstrate)[] = ['title', 'desc', 'type', 'subType'];
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
  const formItems = fields.map((field, idx) => {
    const [loading, setloading] = useState(false);
    const [state, setstate] = useState(data[field]);
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
    <Form {...formItemLayout}>
      {formItems.map(
        ({ field, state, setstate, loading, setloading, label, C, props }) => (
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
  );
}

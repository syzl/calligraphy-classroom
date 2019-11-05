import React from 'react';
import { Formik } from 'formik';
import { Form, Tooltip, Icon, Button, message } from 'antd';
import { Input, Select } from 'formik-antd';
import { useMutation } from '@apollo/react-hooks';
import * as GQL from '../../lib/gql';
import { Demonstrate } from '../../interfaces';
import { hasErrors, getDepCache } from '../../lib/utils';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 16 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function CreateDemonstrate({
  onCompleted,
  clearCache = true,
}: {
  clearCache?: Boolean;
  onCompleted?: Function;
}) {
  const [createDemonstrate, { loading }] = useMutation<
    { createDemonstrate: Demonstrate },
    { input: { title: string } }
  >(GQL.CREATE_DEMOSTRATE, {
    onCompleted() {
      // 清空查询的缓存
    },
    onError(error) {
      message.error(error.message);
    },
    update(proxy, { data }) {
      // 清空 query 开头的
      if (clearCache) {
        const cache = getDepCache(proxy);
        const { ...cacheQuery } = cache.get('ROOT_QUERY');

        Object.keys(cacheQuery).forEach(key => {
          if (key.startsWith('api_demonstrates(')) {
            delete cacheQuery[key];
            cache.delete(`$ROOT_QUERY.${key}`);
          }
        });
        cache.set('ROOT_QUERY', cacheQuery);
      }
      onCompleted && onCompleted(data);
    },
  });
  return (
    <Formik
      initialValues={{ title: '', desc: '', type: '', subType: '', author: '' }}
      validate={values => {
        const errors = {} as any;
        if (!values.title) {
          errors.title = '必填';
        }
        return errors;
      }}
      onSubmit={values => {
        createDemonstrate({ variables: { input: values } });
      }}
    >
      {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item
            label={
              <span>
                名称&nbsp;
                <Tooltip title="所在课程或碑帖等简要段落信息" placement="left">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title || ''}
          >
            <Input
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              placeholder="演示名称"
            />
          </Form.Item>
          <Form.Item
            label={<span>介绍</span>}
            validateStatus={errors.desc ? 'error' : ''}
            help={errors.desc || ''}
          >
            <Input.TextArea
              name="desc"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.desc}
              placeholder="详细介绍"
            />
          </Form.Item>

          <Form.Item
            label="类型"
            validateStatus={errors.type ? 'error' : ''}
            help={errors.type || ''}
          >
            <Select
              name="type"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.type}
              placeholder="选择类型"
              showSearch
              style={{ width: 200 }}
              optionFilterProp="children"
              onSearch={val => {
                console.log('search:', val);
              }}
              filterOption={(input, option) => {
                console.info('options', option, input);
                return false;
                // const r =
                //   option.props.children
                //     .toLowerCase()
                //     .indexOf(input.toLowerCase()) >= 0;
                // return r;
              }}
            >
              <Option value="hard">硬笔</Option>
              <Option value="soft">毛笔</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="更多类型"
            validateStatus={errors.subType ? 'error' : ''}
            help={errors.subType || ''}
          >
            <Input
              name="subType"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.subType}
              placeholder="更多类型"
            />
          </Form.Item>
          <Form.Item
            label="作者"
            validateStatus={errors.author ? 'error' : ''}
            help={errors.author || ''}
          >
            <Input
              name="author"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.author}
              placeholder="作者"
            />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={hasErrors(errors)}
            >
              添加
            </Button>
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
}

import React, { FunctionComponent, useState } from 'react';
import { Row, Col, Typography, Spin } from 'antd';
import { wait } from '../../lib/utils';

interface UpdatorProps {
  value?: string;
  onUpdate: (str: string) => void;
}

interface FieldItemProps extends Omit<UpdatorProps, 'onUpdate'> {
  onUpdate?: (str: string) => void;

  label: string;
  updatorComponent?: FunctionComponent<UpdatorProps>;
  onError?: (err: Error) => void;
}

export const defaultOnError = function(err: Error) {
  // message
  console.info('err', err);
};

export const DefaultUpdator = function({ value, onUpdate }: UpdatorProps) {
  return (
    <Typography.Paragraph
      style={{ whiteSpace: 'pre' }}
      editable={{
        onChange: str => {
          return onUpdate(str);
        },
      }}
    >
      {value}
    </Typography.Paragraph>
  );
};

const FieldItem = ({
  label,
  value,
  onUpdate,
  onError,
  updatorComponent: UpdatorComponent = DefaultUpdator,
}: FieldItemProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <Spin spinning={loading}>
      <Row type="flex">
        <Col style={{ minWidth: '4em', paddingRight: '.8em' }}>
          <Typography.Text strong>{label}:</Typography.Text>
        </Col>
        <Col style={{ flex: 1 }}>
          <UpdatorComponent
            value={value || ''}
            onUpdate={async str => {
              if (str === value || !onUpdate) {
                return;
              }

              setLoading(true);
              try {
                await Promise.all([onUpdate(str), wait(300)]);
              } catch (err) {
                if (onError) {
                  onError(err);
                } else {
                  throw err;
                }
              }
              setLoading(false);
            }}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default FieldItem;

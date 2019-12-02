import React, { FunctionComponent, useState, ReactNode } from 'react';
import { Row, Col, Typography, Spin } from 'antd';
import { wait } from '../../lib/utils';

interface UpdatorProps {
  value?: string;
  onUpdate?: (str: string) => void;
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
      {...(onUpdate
        ? {
            editable: {
              onChange: str => {
                return onUpdate(str);
              },
            },
          }
        : null)}
    >
      {value}
    </Typography.Paragraph>
  );
};

export const FieldItemRaw = ({
  label,
  children,
}: {
  label?: string | number;
  children?: ReactNode;
}) => (
  <Row type="flex">
    <Col style={{ minWidth: '4em', paddingRight: '.8em' }}>
      <Typography.Text strong>{label}:</Typography.Text>
    </Col>
    <Col style={{ flex: 1 }}>{children}</Col>
  </Row>
);

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
      <FieldItemRaw label={label}>
        <UpdatorComponent
          value={value || ''}
          {...(onUpdate
            ? {
                onUpdate: async str => {
                  if (str === value) {
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
                },
              }
            : undefined)}
        />
      </FieldItemRaw>
    </Spin>
  );
};

export default FieldItem;

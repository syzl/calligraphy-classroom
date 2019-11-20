import React, { FunctionComponent } from 'react';
import { Row, Col, Typography } from 'antd';

interface UpdatorProps {
  value?: string;
  onUpdate: (str: string) => void;
}

const DefaultUpdator = function({ value, onUpdate }: UpdatorProps) {
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
  updatorComponent: UpdatorComponent = DefaultUpdator,
}: {
  label: string;
  value?: string;
  onUpdate?: (str: string) => void;
  updatorComponent?: FunctionComponent<UpdatorProps>;
}) => {
  return (
    <Row type="flex">
      <Col style={{ width: '4em' }}>
        <Typography.Text strong>{label}:</Typography.Text>
      </Col>
      <Col style={{ flex: 1 }}>
        <UpdatorComponent
          value={value}
          onUpdate={str => {
            if (str === value) {
              return;
            }
            onUpdate && onUpdate(str);
          }}
        />
      </Col>
    </Row>
  );
};

export default FieldItem;

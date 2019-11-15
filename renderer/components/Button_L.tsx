import React, { useState } from 'react';
import Button, { ButtonProps } from 'antd/lib/button';
import { wait } from '../lib/utils';

interface Props extends ButtonProps {
  onComplete?: Function;
}

export default function Button_L({ onClick, onComplete, ...props }: Props) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      {...props}
      loading={loading}
      onClick={async e => {
        if (!onClick) return;
        setLoading(true);
        await Promise.all([wait(600), onClick(e)]);
        setLoading(false);
        await wait(20);
        onComplete && onComplete();
      }}
    />
  );
}

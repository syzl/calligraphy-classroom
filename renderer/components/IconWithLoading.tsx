import React, { useState } from 'react';
import { Icon } from 'antd';
import { IconProps } from 'antd/lib/icon';
import { wait } from '../lib/utils';

export default function IconWithLoading({ onClick, ...props }: IconProps) {
  const [loading, setLoading] = useState(false);
  return (
    <Icon
      {...props}
      spin={loading}
      onClick={async e => {
        if (!onClick) return;
        setLoading(true);
        await Promise.all([wait(1000), onClick(e)]);
        setLoading(false);
      }}
    />
  );
}

import React, { useState } from 'react';
import { Button, Icon } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { IconProps } from 'antd/lib/icon';

export const genLoadingComponent = function<
  T extends {
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  }
>(AntComp: React.ElementType) {
  return function LoadingComponent(props: T) {
    const [loading, setLoading] = useState(false);

    return (
      <AntComp
        {...props}
        loading={loading}
        onClick={async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
          const onClick = props.onClick;
          if (!onClick) return;
          setLoading(true);
          await onClick(e);
          setLoading(false);
        }}
      />
    );
  };
};

export const genOnceComponent = function<
  T extends {
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  }
>(AntComp: React.ElementType) {
  return function LoadingComponent(props: T) {
    const [loading, setLoading] = useState(false);

    return (
      <AntComp
        {...props}
        loading={loading}
        onClick={async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
          const onClick = props.onClick;
          if (!onClick) return;
          setLoading(true);
          onClick(e);
        }}
      />
    );
  };
};

export const Button_ = genLoadingComponent<ButtonProps>(Button);
export const Button__ = genOnceComponent<ButtonProps>(Button);

export const Icon_ = genLoadingComponent<IconProps>(Icon);
export const Icon__ = genOnceComponent<IconProps>(Icon);

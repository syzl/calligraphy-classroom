import React, { useState } from 'react';
import { Button, Icon } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { IconProps } from 'antd/lib/icon';

export const genLoadingComponent = function<
  T extends {
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  }
>(AntComp: React.ElementType, key = 'loading') {
  return function LoadingComponent(props: T) {
    const [loading, setLoading] = useState(false);

    const loadingProp = {
      [key]: loading,
    };
    return (
      <AntComp
        {...props}
        {...loadingProp}
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
>(AntComp: React.ElementType, key = 'loading') {
  return function LoadingComponent(props: T) {
    const [loading, setLoading] = useState(false);

    const loadingProp = {
      [key]: loading,
    };
    return (
      <AntComp
        {...props}
        {...loadingProp}
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

export const Icon_ = genLoadingComponent<IconProps>(Icon, 'spin');
export const Icon__ = genOnceComponent<IconProps>(Icon, 'spin');

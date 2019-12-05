import React, { FunctionComponent } from 'react';
import App from 'next/app';

import '../assets/global.less';

const DynamicWrapper: FunctionComponent = function({ children }) {
  return <div>{children}</div>;
};

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <DynamicWrapper>
        <Component {...pageProps} />
      </DynamicWrapper>
    );
  }
}

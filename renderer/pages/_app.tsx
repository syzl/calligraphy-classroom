import React from "react";
import App from "next/app";

import DynamicWrapper from "../components/DynamicWrapper";

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

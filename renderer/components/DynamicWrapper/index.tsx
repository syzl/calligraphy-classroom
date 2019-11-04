import { useState, FunctionComponent } from "react";

import AppAbout from "./about";
import { useRouter } from "next/router";

const wrappers: { [key: string]: FunctionComponent<any> } = {
  "/about": AppAbout
};

const DefaultWrapper: FunctionComponent = function({ children }) {
  const [state, setstate] = useState(1);
  return (
    <div className="layout">
      <h2>Main _app.js{state}</h2>
      <button onClick={() => setstate(state + 1)}>count</button>
      <hr />
      {children}
    </div>
  );
};

const DynamicWrapper: FunctionComponent = function({ children }) {
  const { pathname } = useRouter();
  const WrapperComponent = wrappers[pathname] || DefaultWrapper;
  return <WrapperComponent>{children}</WrapperComponent>;
};

export default DynamicWrapper;

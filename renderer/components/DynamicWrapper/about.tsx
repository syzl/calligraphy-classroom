import React, { useState, FunctionComponent } from "react";

const Layout: FunctionComponent = function({ children }) {
  const [state, setstate] = useState(1);
  return (
    <div className="layout">
      <h2>Sub _app.js{state}</h2>
      <button onClick={() => setstate(state + 1)}>count</button>
      <hr />
      {children}
    </div>
  );
};

export default Layout;

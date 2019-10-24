import * as React from 'react';
import { Link } from 'react-router-dom';

const routes = require('../constants/routes.json');

export default function Nav({ children }: { children?: any }) {
  return (
    <div style={{ display: 'flex', padding: 3, paddingTop: 26 }}>
      <Link to={routes.HOME}>首页</Link>
      {children}
    </div>
  );
}

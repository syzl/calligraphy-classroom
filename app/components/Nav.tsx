import * as React from 'react';
import { Link } from 'react-router-dom';

const routes = require('../constants/routes.json');

export default function Nav({ children }) {
  return (
    <div style={{ display: 'flex', padding: 3 }}>
      <Link to={routes.HOME}>首页</Link>
      {children}
    </div>
  );
}

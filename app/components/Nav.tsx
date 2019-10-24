import * as React from 'react';
import { Link } from 'react-router-dom';

const routes = require('../constants/routes.json');

export default function Nav() {
  return (
    <div>
      <Link to={routes.HOME}>to Home</Link>
    </div>
  );
}

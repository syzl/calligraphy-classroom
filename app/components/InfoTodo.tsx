import * as React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../constants/routes.json';

const styles = require('./InfoTodo.css');

export default function InfoTodo() {
  return (
    <div className={styles.info}>
      未完成
      <div>
        <Link to={routes.HOME}>to Home</Link>
      </div>
    </div>
  );
}

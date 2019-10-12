import * as React from 'react';
import { Link } from 'react-router-dom';
const routes = require('../../constants/routes.json');
const styles = require('../Home.css');

export default function Page() {
  return (
    <div className={styles.container} data-tid="container">
      <h2>Frame Page</h2>
      <Link to={routes.HOME}>to Home</Link>
    </div>
  );
}

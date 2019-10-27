import * as React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../constants/routes.json';

const styles = require('./Home.css');

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.band}>
        <div className={styles.title}>书法课堂 · 快速导航</div>
        <div className={styles.nav}>
          <div>
            <Link to={routes.CLASS_ROOMS}>
              <div className={styles.navimg}>
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/URIeCOKLMAbRXaeXoNqN.svg"
                  alt="icon"
                />
              </div>
              <h3>课堂</h3>
            </Link>
          </div>
          <div>
            <Link to={routes.FRAME}>
              <div className={styles.navimg}>
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/qXncdwwUTTgUFnsbCNCE.svg"
                  alt="icon"
                />
              </div>
              <h3>临摹</h3>
            </Link>
          </div>
          <div>
            <Link to={routes.TODO}>
              <div className={styles.navimg}>
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/YFXXZocxAgjReehpPNbX.svg"
                  alt="icon"
                />
              </div>
              <h3>[TODO]</h3>
            </Link>
          </div>
          <div>
            <Link to={routes.TODO}>
              <div className={styles.navimg}>
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/VPuetGsvJuYBwoDkZWFW.svg"
                  alt="icon"
                />
              </div>
              <h3>[TODO]</h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

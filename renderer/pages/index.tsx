import * as React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';

const IndexPage: NextPage = () => {
  return (
    <div className="container">
      <div className="band">
        <div className="title">书法课堂 · 快速导航</div>
        <div className="nav">
          <div>
            <Link href="/dashboard">
              <a>
                <div className="navimg">
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/URIeCOKLMAbRXaeXoNqN.svg"
                    alt="icon"
                  />
                </div>
                <h3>课堂</h3>
              </a>
            </Link>
          </div>
          <div>
            <Link href="/copy-painting">
              <a>
                <div className="navimg">
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/qXncdwwUTTgUFnsbCNCE.svg"
                    alt="icon"
                  />
                </div>
                <h3>临摹</h3>
              </a>
            </Link>
          </div>
          <div>
            <Link href="/">
              <a>
                <div className="navimg">
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/YFXXZocxAgjReehpPNbX.svg"
                    alt="icon"
                  />
                </div>
                <h3>[TODO]</h3>
              </a>
            </Link>
          </div>
          <div>
            <Link href="/">
              <a>
                <div className="navimg">
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/VPuetGsvJuYBwoDkZWFW.svg"
                    alt="icon"
                  />
                </div>
                <h3>[TODO]</h3>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .container h2 {
          font-size: 5rem;
        }

        .container a {
          font-size: 1.4rem;
        }

        .container .band {
          margin: 2em 0;
          background: #533fdc;
          color: #fff;
          min-height: 100px;
          flex: 1;
        }

        .band .title {
          margin: 140px auto 100px;
          font-weight: 400;
          font-size: 38px;
          line-height: 46px;
          text-align: center;
        }
        .band a {
          color: #f2f2f4;
        }
        .band .nav {
          display: flex;
          padding: 0 10%;
          justify-content: space-around;
        }

        .band .nav .navimg {
          width: 120px;
          height: 120px;
          margin: 46px auto 40px;
          background: #fff;
          border-radius: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .debug {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default IndexPage;

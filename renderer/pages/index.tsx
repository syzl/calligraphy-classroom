import React from 'react';

import { NextPage } from 'next';

const IndexPage: NextPage = () => {
  return (
    <div className="container">
      <div className="band">
        <div className="title">Demonstrate</div>
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
          background: linear-gradient(180deg, #70f, #40f);
          color: #fff;
          min-height: 100px;
          flex: 1;
        }

        .band .title {
          margin: 140px auto 10px;
          font-weight: 400;
          font-size: 38px;
          line-height: 46px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default IndexPage;

import React, { useState } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { Dropdown, Icon } from 'antd';

import { LoginForm } from '../components/auth/LoginForm';
import { UserMenu } from '../components/auth/UserMenu';
import { withApollo } from '../lib/apollo';
import checkLoggedIn from '../lib/checkLoggedIn';
import { WhoAmI } from '../interfaces';
import { MixedNextPageContext } from '../lib/lib.interface';

type Props = {
  whoami: WhoAmI;
};

const IndexPage: NextPage<Props> = ({ whoami }) => {
  const [username, setUsername] = useState(whoami.username);
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="container">
      <div className="band">
        <div className="top">
          <Dropdown.Button
            trigger={['click']}
            visible={showMenu}
            onVisibleChange={setShowMenu}
            overlay={
              <div>
                {username ? (
                  <UserMenu
                    onLogout={() => {
                      setUsername('');
                      setShowMenu(false);
                    }}
                  />
                ) : (
                  <LoginForm
                    onSubmit={() => {
                      setUsername(localStorage.getItem('__username') || '');
                      setShowMenu(false);
                    }}
                  />
                )}
              </div>
            }
            icon={<Icon type="user" />}
          >
            {username || '未登陆'}
          </Dropdown.Button>
        </div>
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
            <Link href="/student">
              <a>
                <div className="navimg">
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/YFXXZocxAgjReehpPNbX.svg"
                    alt="icon"
                  />
                </div>
                <h3>学生</h3>
              </a>
            </Link>
          </div>
          <div>
            <Link href="/teacher">
              <a>
                <div className="navimg">
                  <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/VPuetGsvJuYBwoDkZWFW.svg"
                    alt="icon"
                  />
                </div>
                <h3>讲师</h3>
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

        .top {
          display: flex;
          justify-content: flex-end;
          padding: 0.5em;
        }
      `}</style>
    </div>
  );
};
IndexPage.getInitialProps = async (context: MixedNextPageContext) => {
  const { whoami } = await checkLoggedIn(context.apolloClient);
  return { whoami };
};

export default withApollo(IndexPage, { ssr: false, needAuth: false });

import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, Icon } from 'antd';

import { LoginForm } from './auth/LoginForm';
import { UserMenu } from './auth/UserMenu';
import { useRouter } from 'next/router';
import { WhoAmI } from '../interfaces';
import { WHOAMI } from '../lib/gql';
import { useLazyQuery } from '@apollo/react-hooks';
import { pureWithApollo } from '../lib/apollo';
import { IdentityContext } from './identityCtx';

const Status = function() {
  const { identity } = useContext(IdentityContext);
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [fn, { data, called, refetch }] = useLazyQuery<{ auth_whoami: WhoAmI }>(
    WHOAMI,
  );
  const [username, setUsername] = useState('');
  useEffect(() => {
    called || fn();
    const initUsername = data ? data.auth_whoami.username : '';
    setUsername(initUsername);
  }, [data]);

  useEffect(() => {
    setUsername(identity.username || '');
    if (!identity.username) {
      return;
    }
    refetch && refetch();
  }, [identity]);

  return (
    <div className="top">
      <Dropdown.Button
        onClick={() => {
          if (!username) {
            router.push('/login');
          }
        }}
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
                theEnd={() => {
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
      <style jsx>
        {`
          .top {
            display: flex;
            justify-content: flex-end;
            padding: 0.5em;
            position: fixed;
            left: 10px;
            bottom: 5px;
            z-index: 1000;
          }
        `}
      </style>
    </div>
  );
};

export default pureWithApollo(Status);

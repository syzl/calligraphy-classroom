import React, {
  Dispatch,
  useState,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import { Input, Row, Form, Icon, Button, Alert } from 'antd';

import {
  DEVURLS,
  SERVER_URL,
  WS_SERVER_URL,
  GQL_URI,
  GQL_WS_URI,
} from '../../lib/constant';

interface URLS {
  SERVER_URL: string;
  WS_SERVER_URL: string;
  GQL_URI: string;
  GQL_WS_URI: string;
}

const URLS_ON: URLS = {
  SERVER_URL,
  WS_SERVER_URL,
  GQL_URI,
  GQL_WS_URI,
};

const safeLS = function(key: string) {
  if (typeof window === 'undefined') {
    return '';
  }
  return localStorage.getItem(key);
};

const useLocalStorage = function(
  key: string,
  initialValue: string,
): [string, Dispatch<string>] {
  const [value, setValue] = useState(() => safeLS(key) || initialValue);
  const setItem = (newValue: string) => {
    setValue(newValue);
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(key, newValue);
  };
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const newValue = window.localStorage.getItem(key);
    if (value !== newValue) {
      setValue(newValue || initialValue);
    }
  });
  const handleStorage = useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.newValue !== value) {
        setValue(event.newValue || initialValue);
      }
    },
    [value],
  );
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [handleStorage]);
  return [value, setItem];
};

const ParamItem = function({
  paramKey,
  onChange,
}: {
  paramKey: keyof URLS;
  onChange: (value: any, origin: any) => void;
}) {
  const [value, setParam] = useLocalStorage(paramKey, '');
  const currentValue = URLS_ON[paramKey];
  const toEffectValue = value || DEVURLS[paramKey];
  const changed = currentValue !== toEffectValue;
  useEffect(() => {
    onChange(toEffectValue, currentValue);
  }, []);
  return (
    <Row>
      <Form.Item
        label={<span>{paramKey}</span>}
        validateStatus={changed ? 'warning' : 'validating'}
        help={`${
          changed ? `${currentValue} -> ${toEffectValue}` : currentValue
        }`}
      >
        <Input
          allowClear
          size="large"
          placeholder="输入 SERVER_URL"
          value={value}
          onChange={e => {
            setParam(e.target.value);
            onChange(e.target.value || DEVURLS[paramKey], currentValue);
          }}
          addonAfter={
            <Icon
              type="reload"
              onClick={() => {
                setParam(currentValue);
                onChange(currentValue, currentValue);
              }}
            />
          }
        />
      </Form.Item>
    </Row>
  );
};

const initialState: boolean[] = [];
interface Action {
  index: number;
  val: boolean;
}
function reducer(state: boolean[], action: Action) {
  const { index, val } = action;
  state[index] = val;
  return [...state];
}

export default function Settings() {
  const keys: (keyof URLS)[] = [
    'SERVER_URL',
    'WS_SERVER_URL',
    'GQL_URI',
    'GQL_WS_URI',
  ];

  const [state, dispatch] = useReducer(reducer, initialState);
  const hasChanged = state.some(Boolean);

  return (
    <div>
      <Alert message="表单参数修改实时存储, 刷新生效" banner />
      <div className="forms" style={{ width: 400, margin: '10vh auto' }}>
        {keys.map((key, idx) => (
          <ParamItem
            key={key}
            paramKey={key}
            onChange={(value, origin) => {
              dispatch({ index: idx, val: value !== origin });
            }}
          />
        ))}
        {hasChanged && (
          <Button
            type="primary"
            onClick={() => {
              location.reload();
            }}
          >
            重载页面(使配置生效)
          </Button>
        )}
      </div>
    </div>
  );
}

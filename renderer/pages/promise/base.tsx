import React, { useState } from 'react';

interface PNodeProp {
  duration?: number;
  next?: any; // 下一步
  logic?: any; // 依赖逻辑进行下一步
}

// enum PNodeNext {
//   resolve = 'resolve',
//   reject = 'reject',
//   '' = '',
// }

type PNodeNext = 'resolve' | 'reject' | '';

const PNode = function({}: PNodeProp) {
  const [hoverTarget, setHoverTarget] = useState<PNodeNext>();

  return (
    <div className="p-node">
      <div
        className="river resolve"
        onMouseOver={() => setHoverTarget('resolve')}
        onMouseOut={() => setHoverTarget('')}
        style={{
          flex:
            hoverTarget === 'resolve' ? 4 : hoverTarget === 'reject' ? 3 : 3.5,
        }}
      ></div>
      <div className="river start">{hoverTarget}</div>
      <div
        className="river reject"
        onMouseOver={() => setHoverTarget('reject')}
        onMouseOut={() => setHoverTarget('')}
        style={{
          flex:
            hoverTarget === 'reject' ? 4 : hoverTarget === 'resolve' ? 3 : 3.5,
        }}
      ></div>
      <style jsx>{`
        div.p-node {
          width: 130px;
          height: 60px;
          border: thin solid red;
          border-radius: 4px;
          background: lightgrey;
          display: flex;
          flex-direction: column;
        }
        div.river {
          min-width: 30%;
          min-height: 10px;
          border: thin solid red;
          border-radius: 4px;
          background: lightblue;
          flex: 3;
          transition: all 0.2s;
        }

        .start {
          margin-right: 30%;
        }
        .resolve,
        .reject {
          margin-left: 60%;
          flex: 3.5;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default function PromiseBase() {
  return (
    <div>
      <h1>Promise Base</h1>
      <hr />
      <PNode></PNode>
    </div>
  );
}

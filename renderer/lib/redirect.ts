import Router from 'next/router';
import { MixedNextPageContext } from './lib.interface';

export default (context: MixedNextPageContext | any, target: string) => {
  console.info('ctx ~~~', context.res);
  if (context && context.res) {
    // server
    // 303: "See other"
    if (typeof context.res.writeHead === 'function') {
      context.res.writeHead(303, { Location: target });
      context.res.end();
    }
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Router.replace(target);
  }
};

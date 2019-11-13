import Router from 'next/router';
import { ServerResponse } from 'http';

interface Ctx {
  res?: ServerResponse;
  [key: string]: any;
}

export default (context: Ctx, target: string) => {
  if (context.res) {
    // server
    // 303: "See other"
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Router.replace(target);
  }
};

"use strict";

import compose   from 'koa-compose';
import Router    from 'koa-router';
import importDir from 'import-dir';

const routerConfigs = [
  //最后一个在使用SPA前端时，可以在应用最后将所有的重定向到/index.html
  //注意：这个文件中有过滤/api和/auth开头的链接
  //因此如果使用SPA，请保证其它的API放置到专用目录
  { folder: 'api/spa_default_route', prefix: ''},
  
  { folder: 'api', prefix: '/api' },
  { folder: 'auth', prefix: '/auth' },
  { folder: '../graphql/route', prefix: '/api' },
  { folder: 'api/user', prefix: '/api/user' },
  { folder: 'api/_test', prefix: '/api/test' },
  { folder: 'api/upload', prefix: '/api/file' },
  
];

export default function routes() {
  const composed = routerConfigs.reduce((prev, curr) => {
    const routes = importDir('./' + curr.folder);
    const router = new Router({
      prefix: curr.prefix
    });

    Object.keys(routes).map(name => routes[name](router));

    return [router.routes(), router.allowedMethods(), ...prev];
  }, []);
  return compose(composed);
}
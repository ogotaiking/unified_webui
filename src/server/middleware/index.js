'use strict';

import compose from 'koa-compose';
import logger from 'koa-logger';
import cors from 'koa-cors';
import BodyParser from 'koa-bodyparser';
import StaticFile from 'koa-static';
import etag from 'koa-etag';
import CSRF from 'koa-csrf';

import {
  ServerConfig,
  CorsConfig
} from '../../../config';

import AppTimeOut from './utils/timeout';

export default function middleware() {
  return compose([
    //用于每个URL的日志记录和具体访问响应时间记录，需要放置在middleware chain的最前端
    logger(),

    //Koa-bodyparser:对于post等提交的参数body进行处理，处理结果放置于ctx.request.body
    BodyParser({
      enableTypes: ['json', 'form', 'text']
    }),

    //CORS 
    //cors(CorsConfig()),

    //E-Tag
    etag(),

    // CSRF
    // https://www.npmjs.com/package/koa-csrf
    // 是否采用JWT+Session的方式认证post消息?
    // 每次登陆时，register api 获得token将其存在localStorage
    // 然后对POST API call的时候，包含Authrization header

    /**
    new CSRF({
      invalidSessionSecretMessage: 'Invalid session secret',
      invalidSessionSecretStatusCode: 403,
      invalidTokenMessage: 'Invalid CSRF token',
      invalidTokenStatusCode: 403,
      excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
      disableQuery: false
    }),
    */




    //用于某些慢操作的超时处理
    AppTimeOut(ServerConfig.app_timeout),

    //Koa-Static: 用于react+webpack打包生成的静态文件访问
    StaticFile(__dirname + "/../../../dist", {
      extensions: ['html']
    }),
  ]);
}
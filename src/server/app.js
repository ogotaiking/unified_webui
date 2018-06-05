"use strict";
import passport from 'koa-passport';
import Koa from 'koa';
import KeyGrip from 'keygrip';
import Session from 'koa-session';
import RedisStore from 'koa-redis';
import socket from 'socket.io';
import https from 'https';
import fs from 'fs';
import onerror from 'koa-onerror';
import ratelimit from 'koa-ratelimit';
import Redis from 'ioredis';
import helmet from 'koa-helmet';

import { SessionConfig,RateLimitDB }    from '../../config';
import middleware           from './middleware';
import HandleKoaSession     from './middleware/socketio/handle_koa_session';
import iomiddleware         from './middleware/socketio';
import auth                 from './auth';
import routes               from './route';
import SocketDB             from './models/socket';
import LoginHistory         from './models/loginhistory';

import GraphQLSubServer     from './graphql/SubServer';
import GQL_Schema            from './graphql/schema';


/*
 *  HTTPS Certification
 */
const privateKey  = fs.readFileSync(__dirname + '/../../config/cert/server.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '/../../config/cert/server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};


function debugctx () {
    return async function (ctx, next) {
        console.log(ctx.state);
        await next(); 
    };
}

const app = new Koa();
app.keys = new KeyGrip(SessionConfig.SessionKeys, 'sha256');

//helmet是一个安全组件，例如将X-powered-by改为PHP *^oo^*
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

//RateLimit
app.use(ratelimit({
    db: new Redis(RateLimitDB),
    duration: 60000,
    errorMessage: 'Sometimes You Just Have to Slow Down.',
    id: (ctx) => ctx.ip,
    /** headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total'
    },**/
    max: 1000,
    disableHeader: false,
}));

//rate-limit也可以根据ip或者user-id等进行单独的限制， 例子如下：
/**
 * var ratelimit = require('koa-ratelimit');
var redis = require('redis');
var koa = require('koa');
var app = koa();

var emailBasedRatelimit = ratelimit({
  db: redis.createClient(),
  duration: 60000,
  max: 10,
  id: function (context) {
    return context.body.email;
  }
});

var ipBasedRatelimit = ratelimit({
  db: redis.createClient(),
  duration: 60000,
  max: 10,
  id: function (context) {
    return context.ip;
  }
});
 */

//引入Session中间件及使用Redis持久化
const sessStore = new RedisStore(SessionConfig.SessionRedisOption);
SessionConfig.Options.store = sessStore;
app.use(Session(SessionConfig.Options,app));




//批量加载中间件的一个函数，一些简单的中间件可以在middleware目录写入并加载
//降低app.js的复杂度
app.use(middleware());

//TODO : CSRF in Middleware 
// 参考middleware/index.js


//引入认证中间件
app.use(auth());

//app.use(debugctx());



/****************************************************************
 * Socket.IO
 ****************************************************************/

//socket.io binding
const server = https.createServer(credentials, app.callback());
const io = socket(server,{
    pingInterval : 10000,
    pingTimeout : 5000,
    cookie : true
});
io.use(HandleKoaSession(app,SessionConfig.Options));
//add socket.io middleware
iomiddleware(io,sessStore);

// clear LoginHistory and socket.io DB 
// Schema已经配置TTL超时后自动删除， 应该影响不大
// LoginHistory.collection.drop();
// SocketDB.collection.drop();



//graphql-subscription-websocket
const GraphQLSub = GraphQLSubServer(GQL_Schema,server,SessionConfig.Options.key, SessionConfig.Options.store,'/api/graphql_sub');

//Koa-Router: 处理路由，主要涉及服务器后端的身份验证和API等相关的路由
app.use(routes());


//onerror(app);
// error-handling
app.on('error', function(err) {
    if (process.env.NODE_ENV != 'test') {
      console.log('sent error %s to the cloud', err.message);
      console.log(err);
    }
});


export default server;
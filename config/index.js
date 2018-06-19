'use strict';
import { db_username,db_password,Server_IP,SessionKeys,cookie_key} from './auth/config';

export const ServerConfig = {
    'port': 3000,
    'app_timeout': 5000,
    'allow_sign' : true,
    'nginx_enable': false,
    'production' : false,
};

export const SessionConfig = {
    'Options': {
        key: cookie_key,
        /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 24 * 60 * 60 * 1000,
        overwrite: true,
        /** (boolean) can overwrite or not (default true) */
        httpOnly: true,
        /** (boolean) httpOnly or not (default true) */
        signed: true,
        /** (boolean) signed or not (default true) */
        rolling: false,
        /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
        renew: false,
        /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
        sameSite: 'strict',
        secure: true,
    },
    'SessionKeys': SessionKeys,
    'SessionRedisOption': {
        host: '127.0.0.1',
        port: 6379,
        db: 'session_db',
        password: db_password 
    }

};

export const TokenMaxage = 24 * 60 * 60 *3;


export const RateLimitDB = {
    host: '127.0.0.1',
    port: 6379,
    db: 1,
    password: db_password 
};


let MongodbURI_str = 'mongodb://' + db_username + ':' + db_password + '@localhost/webdb';
if ( db_username === '' ) {
    MongodbURI_str = 'mongodb://localhost/webdb';
} 

export const MongodbURI = MongodbURI_str;


export const CorsConfig = () => {
    const accessControlMaxAge = '1200';
  
    const allowedOrigins = [
      'https://' + Server_IP
    ];
  
    const accessControlAllowMethods = [
      'OPTIONS',
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'HEAD'
    ];
  
    const accessControlAllowHeaders = [
      'X-Requested-With',
      'If-Modified-Since',
      'Cache-Control',
      'DNT',
      'X-CustomHeader',
      'Keep-Alive',
      'User-Agent',
      'Content-Type',
      'Authorization',
      'Pragma'
    ];
  
    return {
      origin:      allowedOrigins,
      methods:     accessControlAllowMethods,
      headers:     accessControlAllowHeaders,
      expose:      'Authorization',
      maxAge:      accessControlMaxAge,
      credentials: true
    };
};

export default Object.assign({}, SessionConfig, ServerConfig, MongodbURI,CorsConfig);
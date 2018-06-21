'use strict';
import fs from 'fs';
import isAuthenticated from '../../auth';

//For SPA Client, any unknown URL will redirect to root.
export default (router) => {
    router.get('/*', async (ctx,next)=> { 
        const request_url = ctx.url ;
        if ( 
            request_url.match(/^\/api/) || 
            request_url.match(/^\/auth/) ||
            request_url.match(/^\/socket/) ||
            request_url.match(/^\/img/) 
        ){
            await next();
        } else {
          //console.log('DEFAULT ROUTER');
          ctx.type = 'html';
          ctx.body = fs.createReadStream(__dirname + '/../../../../../dist/index.html');
          //然后由index.html中APP的react-router控制路由的渲染和History记录
        }
    });


};

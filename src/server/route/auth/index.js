'use strict';

import url from 'url';
import passport from "koa-passport";
import jwt from 'jsonwebtoken';
import {
    JWTSignKey
} from '../../../../config/auth/config';

import User from '../../models/user';
import LoginHistory from '../../models/loginhistory';
import {SessionConfig,TokenMaxage } from '../../../../config';
import {
    authLocal,
    authToken,
    generateToken,
    register,
    isAuthenticated,
    isFacebookAuthenticated,
    isFacebookAuthenticatedCallback,
    isGoogleAuthenticated,
    isGoogleAuthenticatedCallback,
    isTwitterAuthenticated,
    isTwitterAuthenticatedCallback,
    isInstagramAuthenticated,
    isInstagramAuthenticatedCallback,
    isGithubAuthenticated,
    isGithubAuthenticatedCallback,
    isLinkedinAuthenticated,
    isLinkedinAuthenticatedCallback
} from '../../auth';

import { CityLookup,ASNLookup } from '../../db/GeoLocation';


//router在import这个文件时已经添加了/auth的前缀了
export default (router) => {
    router.post('/login', async (ctx,next) => {         
        return passport.authenticate('local', (err, user, info, status) => {
            if (user) {
                ctx.login(user);
                
                //创建客户端信息库，用于关键操作的客户端指纹识别
                //更新到User中有助于在ctx.state.user中直接访问和匹配cookie               
                let clientfp_array = user.clientinfo.map((item)=> { return item.clientfp ;});
                let idx = clientfp_array.indexOf(info.clientfp);
                        
                if (idx > -1) {
                    User.findById( user._id, function(err,user) {
                        user.clientinfo[idx].cookie = ctx.header.cookie ;
                        user.save();
                    });
                } else {
                    User.update(
                        {_id: user._id},
                        { $push:
                            { clientinfo : 
                                { clientfp : info.clientfp,
                                  cookie: ctx.header.cookie  }
                            } 
                        }
                    ).exec();                    
                }
                const peer_info = ctx.socket._peername.address + ":" + ctx.socket._peername.port;

                let cityinfo = CityLookup.get(ctx.socket._peername.address);
                let asninfo = ASNLookup.get(ctx.socket._peername.address);
                
                /* test 
                用以下IP地址测试地址，公开的GeoLocation数据库将港澳台标记为国家
                let  test_ip = ''
                //test_ip = '::ffff:14.0.207.94';//hongkong
                //test_ip = '::ffff:140.112.110.1';//taiwan
                //test_ip = '::ffff:122.100.160.253'; //Macau
                cityinfo = CityLookup.get(test_ip);
                asninfo = ASNLookup.get(test_ip);
                */
            

                let location_continent_name =  '';
                let location_region_name = '';
                let location_city_name = '';
                let city_location = {};
                let asn = 0;
                let asname = '';
                
                if (cityinfo) {
                    if(cityinfo.continent) {
                        location_continent_name = cityinfo.continent.names.en ;
                    }
                    if(cityinfo.country) {
                        location_region_name = cityinfo.country.names.en;
                    }
                    if(cityinfo.city) {
                        location_city_name = cityinfo.city.names.en;
                    }

                    if (
                            location_region_name == "Taiwan" || 
                            location_region_name == "Macao" || 
                            location_region_name == "Hong Kong"
                       )                
                    {
                        location_city_name = location_region_name +' '+location_city_name;
                        location_region_name = "China";
                    }



                    if(cityinfo.location) city_location = cityinfo.location;
                }
                if(asninfo) {
                    asn = asninfo.autonomous_system_number;
                    asname = asninfo.autonomous_system_organization;
                }
                                
                LoginHistory.create({
                    uid:            user._id,
                    username:       user.username,
                    cookie:         ctx.header.cookie,
                    clientfp:       info.clientfp,
                    user_agent:     ctx.header['user-agent'],
                    ip:             peer_info,
                    continent:      location_continent_name,
                    region:         location_region_name,
                    city:           location_city_name,
                    location:       city_location,
                    asn:            asn,
                    asname:         asname
                });                   
                
                const _token = jwt.sign({
                    id: user._id,
                    role : user.role,
                    username : user.username,
                    privilegeLevel : user.privilegeLevel
                }, JWTSignKey.secret , { expiresIn: TokenMaxage});
                const token = `JWT ${_token}`;

                ctx.status = 200;
                ctx.body = {
                    status : 'success',
                    uid : user._id,
                    token : token,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    locale: user.locale,
                    role: user.role,
                    privilegeLevel: user.privilegeLevel
                };
                //ctx.redirect('/');
            } else {
                ctx.status = 200;
                ctx.body = {
                    status: 'error',
                    errcode : '401',
                    errmsg  : info.message
                };
            }
            return next();
        })(ctx,next);
    });

    router.post('/logout', async (ctx) => {
        let logout_invalid_flag = true;
       
        if (ctx.isAuthenticated()) {
            let clientfp_array = ctx.state.user.clientinfo.map((item)=> { return item.clientfp});
            let idx = clientfp_array.indexOf(ctx.request.body.clientfp);

            if ( (idx > -1) && (ctx.state.user.clientinfo[idx].cookie == ctx.header.cookie)) {
                User.findById( ctx.state.user._id, function(err,user) {
                    user.clientinfo[idx].cookie = '' ;
                    user.save();
                });
                ctx.logout();
                ctx.status = 200;
                ctx.body = {
                    status : 'success',
                    message : 'logout successfully'
                };
                logout_invalid_flag = false;
            } else {
                ctx.logout();
            }
            //TODO: Add Else here 这可能是一个严重的安全事件， 需要通知用户Cookie和token都已经暴露,
            //      并从一个未知的client登陆了    
        } 
        if (logout_invalid_flag) {
            
            ctx.body = {
                status: 'error',
                errcode : '401',
                errmsg  : 'Unauthorized Logout'
            };
            ctx.status = 401;
        }
    });

    // 针对一些特殊场景可能需要定义新的API来处理带跳转的login/logout
    // 此处我们使用了简单的API Server的方式
    
    router.post('/token', isAuthenticated(), generateToken());
    router.post('/register', register(), generateToken());
    router.get('/github', isGithubAuthenticated());
    router.get('/github/callback', isGithubAuthenticatedCallback());
    
    /**
     * Disable 3rd Party Authentication.
    router.get('/facebook', isFacebookAuthenticated());
    router.get('/facebook/callback', isFacebookAuthenticatedCallback());
    router.get('/google', isGoogleAuthenticated());
    router.get('/google/callback', isGoogleAuthenticatedCallback());
    router.get('/twitter', isTwitterAuthenticated());
    router.get('/twitter/callback', isTwitterAuthenticatedCallback());
    router.get('/instagram', isInstagramAuthenticated());
    router.get('/instagram/callback', isInstagramAuthenticatedCallback());
    router.get('/github', isGithubAuthenticated());
    router.get('/github/callback', isGithubAuthenticatedCallback());
    router.get('/linkedin', isLinkedinAuthenticated());
    router.get('/linkedin/callback', isLinkedinAuthenticatedCallback());
    */
}
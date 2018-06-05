import passport from 'koa-passport';
import compose from 'koa-compose';
import jwt from 'jsonwebtoken';
//import _ from 'underscore';
import base64url from 'base64url';
import User from '../models/user';

import {
    JWTSignKey,
    facebook as FacebookConfig,
    twitter as TwitterConfig
} from '../../../config/auth/config';

import {TokenMaxage} from '../../../config';


/** Strategies */
import localStrategy from './strategies/local';
import jwtStrategy from './strategies/jwt';
import facebookStrategy from './strategies/facebook';
import googleStrategy from './strategies/google';
import twitterStrategy from './strategies/twitter';
import githubStrategy from './strategies/github';
import instagramStrategy from './strategies/instagram';
import linkedinStrategy from './strategies/linkedin';


passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);
passport.use('facebook', facebookStrategy);
passport.use('google', googleStrategy);
passport.use('twitter', twitterStrategy);
passport.use('github', githubStrategy);
passport.use('instagram', instagramStrategy);
passport.use('linkedin', linkedinStrategy);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    (async () => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    })();
});

export default function auth() {
    return compose([
        passport.initialize(),
        passport.session(),
    ]);
}

export function authToken(reqRoleList,reqPrivLevel ) {
    return async (ctx,next) => {         
        return passport.authenticate('jwt', (err, user, info, status) => {
            //console.log(user);
            if (user) {
                //console.log(ctx.state);
                let checkRole = reqRoleList || ['viewer'];
                let checkPriv = reqPrivLevel || 0;
                let isRole = (checkRole.indexOf(user.role) > -1 );
                let isprivilegeLevel = (user.privilegeLevel >= checkPriv );
                if (isRole && isprivilegeLevel) {
                    return next();
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        status: 'error',
                        errcode: '401',
                        errmsg: 'invalid privilege level.'
                    };
                }
            } else {
                ctx.status = 401;
                ctx.body = {
                    status: 'error',
                    errcode : '401',
                    errmsg  : info.message
                };
            }
        })(ctx);
    };
}

export function authLocal() {
    return async (ctx,next) => {         
        return passport.authenticate('local', (err, user, info, status) => {
            if (user) {
                ctx.login(user);
                return next();
            } else {
                ctx.status = 401;
                ctx.body = {
                    status: 'error',
                    errcode : '401',
                    errmsg  : info.message
                };
            }
        })(ctx);
    };
}

//用于对session的验证, 在某些场景中需要验证失败重定向到login的后端时，可以将reqRedirect= True
export function isAuthenticated(reqRoleList,reqPrivLevel,reqRedirect ) {
    return  async  (ctx,next) => { 
        let isRedirect = reqRedirect || false;
        if (ctx.isAuthenticated()) {
            //check role
            let checkRole = reqRoleList || ['viewer',"Admin","Operater"];
            let checkPriv = reqPrivLevel || 0;
            //console.log("ServerRoleList:",checkRole,"ClientRole:",ctx.state.user.role,"CheckResult:",checkRole.indexOf(ctx.state.user.role) > -1 );
            let isRole = (checkRole.indexOf(ctx.state.user.role) > -1 );
            let isprivilegeLevel = (ctx.state.user.privilegeLevel >= checkPriv );
            if (isRole && isprivilegeLevel) {
                await next();
            } else {
                if (isRedirect) {
                    ctx.redirect('/login?redirect='+encodeURI(ctx.req.url));
                } else {
                    ctx.status = 401;
                    ctx.body = {
                            status: 'error',
                            errcode: '401',
                            errmsg: 'invalid privilege level.'
                    };
                }
            }
    } else {
        if (isRedirect) {
            ctx.redirect('/login?redirect='+encodeURI(ctx.req.url));
        } else {
                ctx.status = 401;
                ctx.body = {
                            status: 'error',
                            errcode: '401',
                            errmsg: 'unauthorized access.'
                };
        }
    }
  };
}


export function register() {
  return async (ctx, next) => {
      //console.log(ctx.request.body)
    if ( ctx.request.body.username && ctx.request.body.email && ctx.request.body.phone && ctx.request.body.password) {
        const username = ctx.request.body.username.trim().toLowerCase();
        const email = ctx.request.body.email.trim().toLowerCase();
        const phone = ctx.request.body.phone.trim().toLowerCase();
        const password = ctx.request.body.password;

        const EMAIL_REGEX = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        let _emailValidation = EMAIL_REGEX.test(email);
        let _usernameValidation = true;
        let _phoneValidation = true;

        if (!_emailValidation) {
            ctx.status = 200;
            ctx.body = {
                status: 'error',
                message: 'invalid email format'
            };                  
        }

        if ( _emailValidation && _usernameValidation && _phoneValidation ) {

            // 登陆的时候采用userid单field登陆，
            // 为了避免username-email-phone可能产生的重复导致漏洞
            // 注册时要将三个字段分别查重          

            const isusername = await User.findOne({
                $or: [
                    {'username' : username },
                    {'email'    : username },
                    {'phone'    : username }
                ]
            });

            const isemail = await User.findOne({
                $or: [
                    {'username' : email },
                    {'email'    : email },
                    {'phone'    : email }
                ]
            });

            const isphone = await User.findOne({
                $or: [
                    {'username' : phone },
                    {'email'    : phone },
                    {'phone'    : phone }
                ]
            });     
    
            if (isusername) {
                ctx.status = 200;
                ctx.body = {
                    status: 'error',
                    errcode: '400',
                    errmsg: 'User already registered'
                };
            } else if (isemail) {
                ctx.status = 200;
                ctx.body = {
                    status: 'error',
                    errcode: '400',
                    errmsg: 'E-Mail already registered'
                };
            } else if (isphone) {
                ctx.status = 200;
                ctx.body = {
                    status: 'error',
                    errcode: '400',
                    errmsg: 'Phone already registered'
                };            
            } else {
                let newuser = new User({
                    username,
                    email,
                    phone
                });
    
                newuser.password = newuser.generateHash(password);
                await newuser.save();
    
                ctx.state = {
                    user: newuser._id,
                };
                await next();
            }
        }
    } else {
        ctx.status = 400;
        ctx.body = {
            status: 'error',
            errcode: '400',
            errmsg: 'Invalid input, username/email/phone/password must be required'
        };
    }
};
}


/** After autentication using one of the strategies, generate a JWT token */
export function generateToken() {
    return async ctx => {
        const { user } = ctx.state;
        if (user === false) {
            ctx.status = 401;
            ctx.body = {
                status: 'error',
                errcode : '401',
                errmsg : 'Authentication Error'
            };
        } else {
            const _token = jwt.sign({
                id: user._id,
                role : user.role,
                username : user.username,
                privilegeLevel : user.privilegeLevel
            }, JWTSignKey.secret, { expiresIn: TokenMaxage});
            const token = `JWT ${_token}`;

            let currentUser = await User.findOne({
                _id: user._id
            });

            ctx.status = 200;
            ctx.body = {
                status: "success",
                token,
                uid : currentUser._id,
                username: currentUser.username,
                email: currentUser.email,
                phone: currentUser.phone,
                locale: currentUser.locale,
                role: currentUser.role,
                privilegeLevel: currentUser.privilegeLevel

            };
        }
    };
}

/** Web Facebook Authentication */
export function isFacebookAuthenticated() {
    return async (ctx, next) => {
        await passport.authenticate('facebook', {
            state: base64url(JSON.stringify({
                successRedirect: ctx.request.query.success_redirect,
                failureRedirect: ctx.request.query.failure_redirect
            }))
        })(ctx, next);
    }
}

export function isFacebookAuthenticatedCallback() {
    return async (ctx, next) => {
        let callbackOpts = await JSON.parse(base64url.decode(ctx.request.query.state));
        await passport.authenticate('facebook', function (user, info) {
            if (user) {
                ctx.redirect(callbackOpts.successRedirect);
            } else {
                ctx.redirect(callbackOpts.failureRedirect);
            }
        })(ctx, next);
    }
}

/** Web Twitter Authentication */
export function isTwitterAuthenticated() {
    return async (ctx, next) => {
        await passport.authenticate('twitter', {
            callbackURL: `${ctx.path}/callback?success_redirect=${ctx.request.query.success_redirect}&failure_redirect=${ctx.request.query.failure_redirect}`
        })(ctx, next);
    }
}

export function isTwitterAuthenticatedCallback() {
    return async (ctx, next) => {
        let callbackOpts = ctx.request.query;
        await passport.authenticate('twitter', function (user, info) {
            if (user) {
                ctx.redirect(callbackOpts.success_redirect);
            } else {
                ctx.redirect(callbackOpts.failure_redirect);
            }
        })(ctx, next);
    }
}

/** Web Instagram Authentication */
export function isInstagramAuthenticated() {
    return async (ctx, next) => {
        await passport.authenticate('instagram', {
            state: base64url(JSON.stringify({
                successRedirect: ctx.request.query.success_redirect,
                failureRedirect: ctx.request.query.failure_redirect
            }))
        })(ctx, next);
    }
}

export function isInstagramAuthenticatedCallback() {
    return async (ctx, next) => {
        let callbackOpts = await JSON.parse(base64url.decode(ctx.request.query.state));
        await passport.authenticate('instagram', function (user, info) {
            if (user) {
                ctx.redirect(callbackOpts.successRedirect);
            } else {
                ctx.redirect(callbackOpts.failureRedirect);
            }
        })(ctx, next);
    }
}

/** Web Github Authentication */
export function isGithubAuthenticated() {
    return async (ctx, next) => {
        await passport.authenticate('github', {
            state: base64url(JSON.stringify({
                successRedirect: ctx.request.query.success_redirect,
                failureRedirect: ctx.request.query.failure_redirect
            }))
        })(ctx, next);
    }
}

export function isGithubAuthenticatedCallback() {
    return async (ctx, next) => {
        let callbackOpts = await JSON.parse(base64url.decode(ctx.request.query.state));
        await passport.authenticate('github', function (err, user, info, status) {
            console.log('GITHUBLOGIN',user,info)
            if (user) {
                ctx.login(user);
                ctx.redirect("/");
            } else {
                ctx.redirect(callbackOpts.failureRedirect);
            }
        })(ctx, next);
    }
}

/** TODO: Web Linkedin Authentication */
export function isLinkedinAuthenticated() {
    return async (ctx, next) => {
        await passport.authenticate('linkedin', {
            callbackURL: `${ctx.path}/callback?success_redirect=${ctx.request.query.success_redirect}&failure_redirect=${ctx.request.query.failure_redirect}`
        })(ctx, next);
    }
}

export function isLinkedinAuthenticatedCallback() {
    return async (ctx, next) => {
        let callbackOpts = ctx.request.query;
        await passport.authenticate('linkedin', function (user, info) {
            if (user) {
                ctx.redirect(callbackOpts.success_redirect);
            } else {
                ctx.redirect(callbackOpts.failure_redirect);
            }
        })(ctx, next);
    }
}

/** Web Google Authentication */
export function isGoogleAuthenticated() {
    return async (ctx, next) => {
        await passport.authenticate('google', {
            scope: ['profile', 'email'],
            state: base64url(JSON.stringify({
                successRedirect: ctx.request.query.success_redirect,
                failureRedirect: ctx.request.query.failure_redirect
            }))
        })(ctx, next);
    }
}

export function isGoogleAuthenticatedCallback(ctx, next) {
    return async (ctx, next) => {
        let callbackOpts = await JSON.parse(base64url.decode(ctx.request.query.state));
        await passport.authenticate('google', function (user, info) {
            if (user) {
                ctx.redirect(callbackOpts.successRedirect);
            } else {
                ctx.redirect(callbackOpts.failureRedirect);
            }
        })(ctx, next);
    }
}


//这个函数可能需要更改然后render到一个特殊的页面补充用户信息，例如username password等
export function findOrCreate(query, newFields, done) {
    try {
        User.findOne(query, (err, user) => {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                const newUser = {};
                for (const item in newFields) {
                    newUser[item] = newFields[item];
                }
                user = new User(newUser);
                user.save(err => {
                    if (err) {
                        console.log(err);
                        return done(err, user, {
                            'message': 'Error while saving the user.'
                        });
                    } else {
                        return done(err, user, {
                            'message': 'User successfully saved.'
                        });
                    }
                });
            } else {
                //found user. Return
                return done(err, user, {
                    'message': 'User found.'
                });
            }
        });
    } catch (err) {
        throw new Error("Error in findOrCreate function.");
        // throw后不需要return， 原代码有
        //return done(err);
    }
}


'use strict';
import cookie from 'cookie';
import { execute,subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import jwt from 'jsonwebtoken';
import SocketSchema from '../../models/socket';
import User from '../../models/user';
import { JWTSignKey }    from '../../../../config/auth/config';


const DEBUG = false;

async function SubscriptionAuth(connectionParams, webSocket,socket, sessKey,sessStore) {
    if (!socket.request.headers.cookie) {
        if (DEBUG) { 
            console.log('no cookie in request header');
        }
        socket.isAuthenticated = false;
        webSocket.close();              
        return null;
    }
    //parse cookie并查询Session Store
    
    let sid = cookie.parse(socket.request.headers.cookie)[sessKey];
    let session_info = await sessStore.get(sid);
    if (!session_info) {
        //非法cookie
        if (DEBUG) {
            console.log('cookie not found');
        }
        socket.isAuthenticated = false;
        webSocket.close();
        return null;
    } else if (!session_info.passport.user) {
        //cookie在session store中存在，但passport显示未登陆
        if (DEBUG) {
            console.log('cookie found, but not validated in passport');
        }
        webSocket.close();
        return null;
    } else {
        //检查cookie是否超时
        let currentDate = new Date();
        // let currentDate  = new Date() + session_info._maxAge +1 ;
        if (currentDate >= session_info._expire) {
            //session超时
            if (DEBUG) {
                console.log('cookie timeout');
            }
            socket.isAuthenticated = false;
            webSocket.close();
            return null;
        } else {
            if (!socket.user) {
                const user = await User.findById(session_info.passport.user);
                if (!user) {
                    webSocket.close();
                    return null;
                }
                socket.isAuthenticated = true;
                socket.user = {
                    'sid': sid,
                    'name': user.username,
                    'email': user.email,
                    'role': user.role,
                    'privilegeLevel': user.privilegeLevel,
                    'locale': user.locale
                };
                if (DEBUG) {
                    console.log(`  <<<< connection ${socket.user.name} ${socket.request.connection.remoteAddress}`);
                }

                /* 可选是否在一个Mongo Session Database中记录这些Session

                let query = {'sid':sid};
                let UpdateData = {
                    sid : sid,
                    ip: socket.request.connection.remoteAddress,
                    uid: user._id,
                    username : user.username,
                    user_agent: socket.request.headers['user-agent'],
                    email: user.email,
                    role: user.role,
                    privilegeLevel: user.privilegeLevel,
                    locale: user.locale
                }
                let sessionInDB = await SocketSchema.findOne(query);
                

                if (!sessionInDB) {
                    UpdateData.createTime = Date.now();
                    if (DEBUG) { console.log("UPDATE",UpdateData);}
                    await SocketSchema.create(UpdateData);
                } else {
                    await SocketSchema.findOneAndUpdate(
                        query, 
                        UpdateData,
                        {
                            upsert:true
                        }, 
                        function(err, doc){
                            if (err) { console.log('SocketDB Error:',err)} 
                        }
                    );
                }
                */
               return socket.user;
            }
            return socket.user;
        }
    }
}

export default function CreateGraphQLSubscriptionServer(Schema, serverObj, sessKey,sessStore, subscriptionWSpath) {
    return new SubscriptionServer({
        schema: Schema,
        execute: execute,
        subscribe: subscribe,       
        onConnect: async (connectionParams, webSocket,socket) => {
            return await SubscriptionAuth(connectionParams, webSocket,socket, sessKey,sessStore)

            /*
            console.log(socket.request.headers.cookie)
            if (connectionParams.authToken) {
                const token = connectionParams.authToken.slice(4); // remove JWT from the start of the string
                try {
                    const decoded = await jwt.verify(token, JWTSignKey.secret, function (err,decoded){
                        if (err) {
                            return null;
                        } else {
                            return decoded;
                        }
                    });
                    
                    if (decoded) {
                        const user = await User.find({_id : decoded._id });
                        if (user) return {
                            user
                        };                        
                    }
                    webSocket.close();
                    //throw new Error('Not authorized');
                } catch (err) {
                    console.log(err);
                    webSocket.close();
                }
            }
            webSocket.close();
            */
        },
        

    }, {
        server: serverObj,
        path: subscriptionWSpath
    });
}
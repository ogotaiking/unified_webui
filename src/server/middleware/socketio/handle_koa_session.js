import User from '../../models/user';

export default function HandleKoaSession (app, opt) {
    let store = opt.store;
    let key = opt.key || 'koa:sess';
    return async function(socket, next) {
        if (!socket.handshake.headers.cookie) {
            return next(new Error('no cookie'));
        }
        //console.log("SOCKET/IO",app,socket.request);
        let ctx = app.createContext(socket.request, socket.response);
        let sid = ctx.cookies.get(key, opt);
        let s = await store.get(sid);
        if (s.passport.user) {
            //console.log('User is login',s.passport.user);
            socket.isAuthenticated = true;
            socket.user = await User.findById( s.passport.user);
            //console.log(socket.user.username)
        } else {
            socket.isAuthenticated = false;
            socket.user = null;
        }
        await next();
    };
}
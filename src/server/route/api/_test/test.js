import { isAuthenticated, authToken } from '../../../auth';


export default (router) => {
  router.get('/app_noauth', (ctx, next) => {
    ctx.body = `<script src="/socket.io/socket.io.js"></script><script>
    var socket = io.connect();
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
  </script>`;
});

    //对这个文件的认证授权中间件
    router.use('*', isAuthenticated( ['viewer'] , 0 ,true ) , async (ctx, next) => {
            await next();
    });

    //在此文件接下来的所有的URL将先进行如上的授权认证
    router.get('/app',authToken(), (ctx, next) => {
        ctx.body = `<script src="/socket.io/socket.io.js"></script><script>
        var socket = io.connect();
        socket.on('news', function (data) {
          console.log(data);
          socket.emit('my other event', { my: 'data' });
        });
      </script>`;
    });
};
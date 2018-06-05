'use strict';

import ioAuth from './auth';

export default function (io) {
    io.use((socket, next) => {
        //console.log(socket.isAuthenticated);
        if (!socket.isAuthenticated) {
            return next(new Error('unauthorized'));
        }
        return next();
    });


    io.on('connection', function(socket,next){
       
        socket.on('chat message', async function(msg){
            //console.log('message: ' + msg,socket.user.username);
            io.emit('chat message', socket.user.username +":" +msg);

            const isValid = await ioAuth(socket,['viewer'],0) ;
            if(isValid)
            {
                io.emit('chat message', socket.user.username +":" +msg);
            } else {
                io.emit('chat message', 'invalid access');
                socket.disconnect();
            }
            
        });

        socket.on('disconnect', async () => {
            /*await SocketSchema.remove({
                id: socket.id,
            });*/
            console.log(`  >>>> disconnect`,socket.user.username);
        });

    });
    
    
}
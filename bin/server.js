'use strict';
import 'babel-polyfill';
import 'isomorphic-fetch';

import server from '../src/server/app';
import ConnectDatabase from '../src/server/db/mongodb/index';
import {  ServerConfig,  MongodbURI } from '../config/';
import IOmiddleware from '../src/server/middleware/socketio';


(async () => {
  try {
    const info = await ConnectDatabase(MongodbURI);
    console.log(`MongoDB connected to ${info.host}:${info.port}/${info.name}`);
  } catch (error) {
    console.error('Unable to connect to database', error);
  }

  //启动Koa
  await server.listen(ServerConfig.port,function (){
    console.log(`Server started on port ${ServerConfig.port}`);
  });
  //await app.listen(ServerConfig.port);
  
})();
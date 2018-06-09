'use strict';

import sendfile from 'koa-sendfile';
import multer from 'koa-multer';

//TODO modify PATH to global config folder ?
//或者根据不同的任务需求安排不同的path

const FILE_STORAGE_PATH = '/tmp/upload';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const CLIENT_FORM_UPLOAD_NAME = 'file';

function FileHashName(OriginalName) {
    let fileFormat = (OriginalName).split(".");
    let DateNow = new Date().toLocaleDateString().replace(/\//g,"-");
    return "tradelog."+ DateNow + "." + fileFormat[fileFormat.length - 1];
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, FILE_STORAGE_PATH);
    },
    filename: function (req, file, cb) {
      cb(null, FileHashName(file.originalname) );
    }
  });

const upload = multer({ 
    storage: storage,
    limits:{
        fileSize: MAX_FILE_SIZE
    }
});

// 上传表单以file为文件的字段
const defaultHandler = upload.single(CLIENT_FORM_UPLOAD_NAME);

// 捕获异常
const uploadHandler = async (ctx, next) => {
    try{
      await defaultHandler(ctx, next);
    }catch(e){
      ctx.error = e;
    }
    if(ctx.error){
        ctx.status = 500;
        ctx.body = {
            status: 'error',
            errcode: 500,
            errmsg: 'FILE Size Exceeded.'
        };
    }else{
      let data = ctx.req.file;
      console.log(data);
      ctx.status = 200;
      ctx.body = {
          status : 'success',
          data : {
              hash : data.filename,
              url : '/download/' + data.filename
          }
      };
    }
};

export default (router) => {
    router.post('/upload', uploadHandler);
};
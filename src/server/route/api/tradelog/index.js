'use strict';
import multer from 'koa-multer';
import fs from 'fs';
import iconv from 'iconv-lite';
import csv from 'csv';
import cp from 'child_process';
import stream from 'stream';

function replaceStream(needle, replacer) {
    let ts = new stream.Transform();
    let chunks = [], len = 0, pos = 0;
    ts._transform = function _transform(chunk, enc, cb) {
      chunks.push(chunk);
      len += chunk.length;
      if (pos === 1) {
        let data = Buffer.concat(chunks, len)
            .toString()
            .replace(needle, replacer);
        chunks = [];
        len = 0;
        this.push(data);
      }
      pos = 1 ^ pos;
      cb(null);
    };
    ts._flush = function _flush(cb) {
      if (chunks.length) {
        this.push(Buffer.concat(chunks, len)
          .toString()
          .replace(needle, replacer))
      }
      cb(null);
    };
    return ts;
}
  

//TODO modify PATH to global config folder ?
//或者根据不同的任务需求安排不同的path

const FILE_STORAGE_PATH = '/tmp';
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
      console.log(e);
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
      console.log(data.path);
      let hold_table = new Map();
      fs.createReadStream(data.path)
        .pipe(iconv.decodeStream('gb2312'))
        .pipe(replaceStream(/"/g,''))
        .pipe(replaceStream(/=/g,''))
        .pipe(csv.parse({delimiter: '\t',columns: true}))
        .on('data', function (data) {
            let item = {};
            if (data['买卖标志'] == "证券买入") {
                //修改证券代码符合行情系统前缀标注
                let code = data['证券代码'];
                if ( code.substr(0,2) == '60' ) {
                    code = 'sh' + code;
                } else {
                    code = 'sz' + code;
                }
                //使用Map考虑到可能有多笔同代码成交的情况，
                //根据代码做key，然后merge
                item = hold_table.get(code);
                if (!item) {
                    item = {};
                    item.id = code;
                    item.name = data['证券名称'];
                    item.buy_date = data['成交日期'];
                    item.total_money = parseFloat(data['成交金额']);
                    item.hold_vol = parseFloat(data['成交数量']);
                    item.buy_price = ((item.total_money / item.hold_vol ) * 1.0015).toFixed(3);
                } else {
                    item.hold_vol = item.hold_vol + parseFloat(data['成交数量']);
                    item.total_money = item.total_money + parseFloat(data['成交金额']);
                    item.buy_price = ((item.total_money / item.hold_vol ) * 1.0015).toFixed(3);
                }
                hold_table.set(item.id,item);
            }
      }).on('end', function(){
          //merge to existing hold table
          console.log(hold_table);
          let hold_table_db = fs.createWriteStream('/tmp/hold_table_db',{flags:'a'});
          hold_table_db.on('error',function(err) { /* error Handling*/});
          hold_table.forEach((item)=>{
              const  csv_str = item.id + ',' + item.name + ',' + item.buy_date + ',' + item.buy_price + ',' + item.hold_vol + ',' + item.total_money +'\n';
              hold_table_db.write(csv_str);
          });
          hold_table_db.end();
      }).on('close', function(){
          console.log('something wrong ...')
      })

      

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
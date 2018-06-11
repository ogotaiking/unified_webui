'use strict';
import multer from 'koa-multer';
import fs from 'fs';
import iconv from 'iconv-lite';
import csv from 'csv';
import stream from 'stream';
import sendfile from 'koa-sendfile';
import { isAuthenticated, authToken } from '../../../auth';
import HoldTableDB from '../../../models/stock/hold';
import ClearenceTableDB from '../../../models/stock/clearence';

//TODO modify PATH to global config folder ?
//或者根据不同的任务需求安排不同的path

const FILE_STORAGE_PATH = '/tmp';
const HOLD_TABLE_FILE_PATH = FILE_STORAGE_PATH + '/hold_table.csv';
const CLEARENCE_TABLE_FILE_PATH = FILE_STORAGE_PATH + '/current_clearence.csv';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const CLIENT_FORM_UPLOAD_NAME = 'file';
const DEBUG = false;

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

function processTradeLog(filepath,tradeflag){
    let log_header = 'id,symbol,name,trade_date,trade_price,volume,total_moeny';
    let log_trade_flag = '证券买入';
    let trade_with_tax_ratio =  0.0015;
    let logfilename = HOLD_TABLE_FILE_PATH;
    if (tradeflag == "sell") {
        log_trade_flag = '证券卖出';
        trade_with_tax_ratio = 0;
        logfilename = CLEARENCE_TABLE_FILE_PATH;

    }
    let trade_map = new Map();
    fs.createReadStream(filepath)
      .pipe(iconv.decodeStream('gb2312'))
      .pipe(replaceStream(/"/g,''))
      .pipe(replaceStream(/=/g,''))
      .pipe(csv.parse({delimiter: '\t',columns: true}))
      .on('data', function (data) {
          //if(DEBUG) console.log(data);
          let item = {};
          if (data['买卖标志'] == log_trade_flag ) {
              //修改证券代码符合行情系统前缀标注
              let code = data['证券代码'];
              if ( code.substr(0,2) == '60' ) {
                  code = 'sh' + code;
              } else {
                  code = 'sz' + code;
              }
              //使用Map考虑到可能有多笔同代码成交的情况，
              //根据代码做key，然后merge
              let trade_date_pretty_format = data['成交日期'].substr(0,4)+"-"+data['成交日期'].substr(4,2)+"-"+data['成交日期'].substr(6,2);
              let hash_key = code+"_"+ trade_date_pretty_format;
              item = trade_map.get(hash_key);
              if (!item) {
                  item = {};
                  item.id = hash_key;
                  item.symbol = code;
                  item.name = data['证券名称'];
                  item.trade_date = trade_date_pretty_format;
                  item.total_money = parseFloat(data['成交金额']);
                  item.volume = parseFloat(data['成交数量']);
                  item.trade_price = ((item.total_money / item.volume ) * (1+trade_with_tax_ratio)).toFixed(3);
              } else {
                  item.volume = item.volume + parseFloat(data['成交数量']);
                  item.total_money = item.total_money + parseFloat(data['成交金额']);
                  item.trade_price = ((item.total_money / item.volume ) * (1+trade_with_tax_ratio)).toFixed(3);
              }
              trade_map.set(hash_key,item);
          }
        }).on('end',async function(){
                //merge to existing hold table
                //if(DEBUG) console.log(trade_map);

                //数据备份和创建表头等工作采用同步模式先处理完
                try {
                    let stats = fs.statSync(logfilename);
                    if(DEBUG) console.log('文件存在');
                    fs.copyFileSync(logfilename,logfilename+'.bak');
                    if(DEBUG) console.log('...Done.');
                } 
                catch(err){
                    if(DEBUG) console.log('文件不存在或不是标准文件');
                    fs.writeFileSync(logfilename,log_header+'\n',{flags: 'w'});
                    if(DEBUG) console.log('Done....');
                }

                let DBHandler = HoldTableDB;
                if ( tradeflag == "sell") {
                    DBHandler = ClearenceTableDB;
                    DBHandler.deleteMany({},function(err) { 
                        if(DEBUG) console.log(err); 
                    });           
                } 
                
                DBHandler.insertMany([...trade_map.values()],function(err,docs){
                    if(!err) {
                        //Export to csv for backup....             
                        let logfile = fs.createWriteStream(logfilename,{flags: 'w'});
                        logfile.write(log_header+'\n');
                        let trade_date_flag = '';                        
                        
                        if (tradeflag == 'sell') {
                            docs.map((data)=>{
                                if (trade_date_flag != data.trade_date ) {
                                    //add blank for easy use
                                    logfile.write('\n');
                                    trade_date_flag = data.trade_date;
                                }
                                const  csv_str = data.id + ',' 
                                         + data.symbol + ',' 
                                         + data.name + ',' 
                                         + data.trade_date + ',' 
                                         + data.trade_price + ',' 
                                         + data.volume + ',' 
                                         + data.total_money +'\n';
                                logfile.write(csv_str);
                            });
                            logfile.end();
                        } else {
                            DBHandler.find({},function(err,docs){
                                if(!err) {
                                    docs.map((data)=>{
                                        if (trade_date_flag != data.trade_date ) {
                                        //add blank for easy use
                                        logfile.write('\n');
                                        trade_date_flag = data.trade_date;
                                        }
                                        const  csv_str = data.id + ',' 
                                                + data.symbol + ',' 
                                                + data.name + ',' 
                                                + data.trade_date + ',' 
                                                + data.trade_price + ',' 
                                                + data.volume + ',' 
                                                + data.total_money +'\n';
                                        logfile.write(csv_str);
                                    });
                                    logfile.end();   
                                }
                            });
                        }
                    }
                });    
                //delete temp trade log file.                
                fs.unlink(filepath,function(err){
                    if(err) return console.log(err);
                });
    }).on('close', function(){ console.log('something wrong ...'); });
}
  


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
function uploadHandler(tradeflag) { 
    return  async (ctx, next) => {
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
      
      processTradeLog(data.path,tradeflag);

      ctx.status = 200;
      ctx.body = {
          status : 'success',
          data : {
              hash : data.filename,
              url : '/download/' + data.filename
          }
      };
      
    }
    }
}


export default (router) => {
    router.post('/upload/buy', isAuthenticated( null , 10 ,true ), uploadHandler('buy'));
    router.post('/upload/sell', isAuthenticated( null , 10 ,true ), uploadHandler('sell'));
    router.get('/download/clearence_table',isAuthenticated(), async (ctx) => {
        const path = `${CLEARENCE_TABLE_FILE_PATH}`;
        ctx.attachment(decodeURI(path));
        await sendfile(ctx, path);
    });
};
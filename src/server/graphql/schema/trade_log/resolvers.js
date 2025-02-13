import fs from 'fs';
import csv from 'csv';
import axios from 'axios';
import { PubSub,withFilter } from 'graphql-subscriptions';
import HoldTableDB from '../../../models/stock/hold';
import ClearenceTableDB from '../../../models/stock/clearence';

const pubsub = new PubSub();
const CHANNEL = "TRADE_LOG_DATA";
let stock_market_data = {};
let trading_day_list = [];

const HOLD_TABLE = async (root, args, ctx, info) =>{
    return await HoldTableDB.find({}).sort({"trade_date":1,"symbol":1});
};

const HOLD_TABLE_SUMMARY = async(root, args, ctx, info) =>{
  let trade_map = new Map();
  let hold_table = await HoldTableDB.find({}).sort({"trade_date":1,"symbol":1});
  hold_table.map((data)=>{
    let item = trade_map.get(data.symbol);
    if (!item) {
      data.id = data.symbol;
      trade_map.set(data.symbol,data);
    } else {
      item.total_money = item.total_money + data.total_money;
      item.volume = item.volume + data.volume;
      item.trade_date = item.trade_date + "," + data.trade_date;
      item.trade_price = (item.total_money / item.volume ).toFixed(3);
      trade_map.set(data.symbol,item);
    }
  });
  return [...trade_map.values()];
};


const HOLD_STOCK_LIST = async(root, args, ctx, info) =>{
  let stock_list = new Map();
  let hold_table = await HoldTableDB.find({});
  hold_table.map((data)=>{
    let item = stock_list.get(data.symbol);
    if (!item) {
      stock_list.set(data.symbol,data.symbol);
    } 
  });
  return [...stock_list.values()];
};



const CLEARENCE_STOCK_LIST = async(root, args, ctx, info) =>{
  let stock_list = new Map();
  let hold_table = await ClearenceTableDB.find({});
  hold_table.map((data)=>{
    let item = stock_list.get(data.symbol);
    if (!item) {
      stock_list.set(data.symbol,data.symbol);
    } 
  });
  return [...stock_list.values()];
};



const CLEARENCE_TABLE = async (root, args, ctx, info) =>{
  return await ClearenceTableDB.find({}).sort({"trade_date":1,"symbol":1});
};


/*
const TRADING_DAY = async(root,args,ctx,info) => {
  let result = [];
  let date_array_length = trading_day_list.length;
  if  (date_array_length == 0 ) {
    return ["2018-09-01"];
  }
  for (let idx = date_array_length-args.num; idx< date_array_length; idx++ ){
    let date_str = trading_day_list[idx];
    result.push(date_str);
  }
  //console.log(result);
  return result;  
};
*/


/* some times has issue here  
const TRADING_DAY = async(root,args,ctx,info) => {
  const url = 'http://img1.money.126.net/data/hs/kline/day/times/0000001.json';
  const response = await axios.get(url);
  let data = response.data;
  const date_array = data.times;
  const date_array_length = date_array.length;
  let result = [];
  for (let idx = date_array_length-args.num; idx< date_array_length; idx++ ){
    let date_str = date_array[idx];
    result.push(date_str.substr(0,4)+"-"+date_str.substr(4,2)+"-"+date_str.substr(6,2));
  }
  //console.log(result);
  return result;
};
*/

/*sina source with scale=240 does not include the T+0 Day's data, but could use 5 mins */
const TRADING_DAY = async(root,args,ctx,info) => {
  let TempDateNow = new Date();
  let DateNow = new Date(Math.floor(TempDateNow / 86400000) * 86400000);
  let Last_date = new Date("2018-09-01");
  if ( trading_day_list.length > 1 ) {
    Last_date = new Date(trading_day_list[trading_day_list.length-1]);
  }
  if  ((DateNow - Last_date != 0 ) || (trading_day_list.length < args.num)) {
    //console.log("Fetch New data array",DateNow,Last_date);
        let num_at_scale = args.num * 60;
        const url = 'http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sh000001&scale=5&ma=no&datalen=' + num_at_scale.toString();
        const response = await axios.get(url);
        let data = response.data;       
        data = data.replace(/day/g,'"day"').replace(/open/g,'"open"').replace(/high/g,'"high"').replace(/low/g,'"low"').replace(/close/g,'"close"').replace(/volume/g,'"volume"');
        
        let a = JSON.parse(data);
        let result = [];
        let temp_str = "";
        for (let idx =0; idx < a.length ; idx ++) {
            let item = a[idx];
            let temp_arr = item.day.split(" ");
            if (temp_arr[0] != temp_str ){
              temp_str = temp_arr[0];
              result.push(temp_str);
            }
        }
        trading_day_list = result
  }  

  return trading_day_list.slice(trading_day_list.length-args.num ,trading_day_list.length );
  /*
  let resulta = a.map((item)=>{ 
      return item.day; 
  });

  return result;
  */
}


const REMOVE_HOLD_TABLE_ITEM = async(root, args, ctx, info) =>{
    if ( ctx.state.user.privilegeLevel > 10 ) {
      let result = await HoldTableDB.deleteMany({id: args.id});
      return { NUMBER : result.n, 
        OK: result.ok };

    } else {
      return {
        NUMBER : 0, 
        OK: 0 
      };
    }
    
};

const REMOVE_CLEARENCE_TABLE_ITEM = async(root, args, ctx, info) =>{
  if ( ctx.state.user.privilegeLevel > 10 ) {
    let result = await ClearenceTableDB.deleteMany({id: args.id});
    return { NUMBER : result.n, 
      OK: result.ok };

  } else {
    return {
      NUMBER : 0, 
      OK: 0 
    };
  }
  
};

const UPDATE_TRADING_DAY = async (root,{ tradingday }) =>{
  //console.log(tradingday);
  trading_day_list = tradingday;
  return trading_day_list;
};

const resolvers = {
  Query: {
    HOLD_TABLE: HOLD_TABLE,
    HOLD_TABLE_SUMMARY: HOLD_TABLE_SUMMARY,
    HOLD_STOCK_LIST:HOLD_STOCK_LIST,
    CLEARENCE_TABLE: CLEARENCE_TABLE,
    CLEARENCE_STOCK_LIST:CLEARENCE_STOCK_LIST,    
    TRADING_DAY:TRADING_DAY,
  },
  Mutation: {
    REMOVE_HOLD_TABLE_ITEM: REMOVE_HOLD_TABLE_ITEM,
    UPDATE_TRADING_DAY: UPDATE_TRADING_DAY,
    REMOVE_CLEARENCE_TABLE_ITEM:REMOVE_CLEARENCE_TABLE_ITEM,
  },
  Subscription: {
    
  },
};

export default resolvers;
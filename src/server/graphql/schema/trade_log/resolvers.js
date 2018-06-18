import fs from 'fs';
import csv from 'csv';
import axios from 'axios';
import { PubSub,withFilter } from 'graphql-subscriptions';
import HoldTableDB from '../../../models/stock/hold';
import ClearenceTableDB from '../../../models/stock/clearence';

const pubsub = new PubSub();
const CHANNEL = "TRADE_LOG_DATA";
let stock_market_data = {};

const HOLD_TABLE = async (root, args, ctx, info) =>{
    return await HoldTableDB.find({});
};

const HOLD_TABLE_SUMMARY = async(root, args, ctx, info) =>{
  let trade_map = new Map();
  let hold_table = await HoldTableDB.find({});
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
  return await ClearenceTableDB.find({});
};



const TRADING_DAY = async(root,args,ctx,info) => {
  const url = 'http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sh000001&scale=240&ma=no&datalen=' + args.num.toString();
  const response = await axios.get(url);
  let data = response.data;
  data = data.replace(/day/g,'"day"').replace(/open/g,'"open"').replace(/high/g,'"high"').replace(/low/g,'"low"').replace(/close/g,'"close"').replace(/volume/g,'"volume"');
  let a = JSON.parse(data);
  let result = a.map((item)=>{ 
      return item.day; 
  });
  
  return result;
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
    REMOVE_CLEARENCE_TABLE_ITEM:REMOVE_CLEARENCE_TABLE_ITEM,
  },
  Subscription: {
    
  },
};

export default resolvers;
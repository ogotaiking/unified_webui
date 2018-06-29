/* 
 * 直接使用了graphql的subscription，如果需要和后端的Message Queue通信，
 * 则添加 graphql-redis-subscriptions or graphql-mqtt-subscriptions
 * 来创建如下Pubsub
 */
import { PubSub,withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();
const CHANNEL = "STOCK_MARKET_DATA";
const INDEX_CHANNEL = "STOCK_MARKET_DATA_INDEX";
let stock_market_data = {};
let stock_market_data_index = {};

function convert_date(stock) {
  return Date.parse(stock.currentdate+ " " + stock.currenttime);
}

const STOCK_DATA = (root, args, ctx, info) =>{
  //console.log("ARGS",args);
  let result_list =[];
  args.symbol_list.map((symbol)=>{
    if(stock_market_data[symbol]){
      result_list.push(stock_market_data[symbol]);
    }
  });
  return result_list;
};

const STOCK_INDEX_DATA = (root, args, ctx, info) =>{
  //console.log("ARGS",args);
  let result_list =[];
  args.symbol_list.map((symbol)=>{
    if(stock_market_data_index[symbol]){
      result_list.push(stock_market_data_index[symbol]);
    }
  });
  return result_list;
};

const UPDATE_STOCK_DATA = (root, { stock }) => {
  //console.log({stock});
  return stock.map((item)=>{
    let stock_symbol = item.id;
    stock_market_data[stock_symbol] = item;
    //testing code for refresh...
    //let current_Time = new Date();
    //item.currenttime = current_Time.toTimeString();
    pubsub.publish(INDEX_CHANNEL+"_"+stock_symbol,item);
    return item;
  });
  };


const UPDATE_STOCK_INDEX_DATA = (root, { stock }) => {
  return stock.map((item)=>{
    let stock_symbol = item.id;
    stock_market_data_index[stock_symbol] = item;
    pubsub.publish(INDEX_CHANNEL+"_"+stock_symbol,item);
    return item;
  });
};


const resolvers = {
  Query: {
    STOCK_DATA: STOCK_DATA,
    STOCK_INDEX_DATA: STOCK_INDEX_DATA
  },
  Mutation: {
    UPDATE_STOCK_DATA: UPDATE_STOCK_DATA,
    UPDATE_STOCK_INDEX_DATA: UPDATE_STOCK_INDEX_DATA,
  },
  Subscription: {
    STOCK_DATA: {
      resolve: (payload, args, context, info) => {
        return payload;
      },
      subscribe: (root, args, context, info) => pubsub.asyncIterator(args.symbol_list.map((item)=>{ return INDEX_CHANNEL+"_"+item ;})),
    },

    STOCK_INDEX_DATA: {
      resolve: (payload, args, context, info) => {
        return payload;
      },
      subscribe: (root, args, context, info) => pubsub.asyncIterator(args.symbol_list.map((item)=>{ return INDEX_CHANNEL+"_"+item ;})),
    }
  },
};

export default resolvers;
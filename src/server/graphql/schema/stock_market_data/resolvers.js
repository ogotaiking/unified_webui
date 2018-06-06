/* 
 * 直接使用了graphql的subscription，如果需要和后端的Message Queue通信，
 * 则添加 graphql-redis-subscriptions or graphql-mqtt-subscriptions
 * 来创建如下Pubsub
 */
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const CHANNEL = "STOCK_MARKET_DATA";
let stock_market_data = {};

/*
pubsub.subscribe(CHANNEL, (payload) => {
  console.log(`New message received on channel ${CHANNEL}`);
  try {
    const stock_data = payload[CHANNEL]; // object wrapped in channel name
  } catch (error) {
    console.error(`Error trying to extract new message from payload`);
    console.error(error.message);
  }
})
*/

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


function convert_date(stock) {
  return Date.parse(stock.currentdate+ " " + stock.currenttime)
}

const UPDATE_STOCK_DATA = (root, { stock }) => {
  //console.log({stock});
  let result =[];
  stock.map((item)=>{
    let stock_symbol = item.symbol;
    stock_market_data[stock_symbol] = item;
    result.push(item);
  });
  pubsub.publish(CHANNEL,result);
 // const newMessage = { id: String(nextMessageId++), content: message };
 // pubsub.publish(CHANNEL, { messageAdded: newMessage });
  //console.log(stock_market_data);
  return result;
};

const resolvers = {
  Query: {
    STOCK_DATA: STOCK_DATA,
  },
  Mutation: {
    UPDATE_STOCK_DATA: UPDATE_STOCK_DATA,
  },
  Subscription: {
    LISTEN_STOCK_DATA_BY_SYMBOL_LIST: {
      resolve: (payload, args, context, info) => {
        // Manipulate and return the new value
        
        //console.log(payload)
        let result = [];
        payload.map((item)=>{
          if (args.symbol_list.indexOf(item.symbol) > -1 ) {
            result.push(item);
          } 
        })
        //console.log(Math.floor(Math.random() * 3000));
        //console.log(args.code,result)
        return result;
      },
      subscribe: () => pubsub.asyncIterator(CHANNEL),
    },
    LISTEN_STOCK_DATA: {
      resolve: (payload, args, context, info) => {
        return payload;
      },
      subscribe: () => pubsub.asyncIterator(CHANNEL),
    }
  },
};

export default resolvers;
/* 
 * 直接使用了graphql的subscription，如果需要和后端的Message Queue通信，
 * 则添加 graphql-redis-subscriptions or graphql-mqtt-subscriptions
 * 来创建如下Pubsub
 */
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const CHANNEL = "STOCK_MARKET_DATA";
let stock_market_data = {};

pubsub.subscribe(CHANNEL, (payload) => {
  console.log(`New message received on channel ${CHANNEL}`);
  try {
    const stock_data = payload[CHANNEL]; // object wrapped in channel name
    stock_market_data['sz000001']= stock_data ; 
    console.log(`Added message to database`);
  } catch (error) {
    console.error(`Error trying to extract new message from payload`);
    console.error(error.message);
  }
})

const STOCK_DATA = (root, args, ctx, info) =>{
  //console.log("ARGS",args);
  let result_list =[];
  args.symbol_list.map((symbol)=>{
    if(stock_market_data[symbol]){
      result_list.push(stock_market_data[symbol]);
    }
  });
  return result_list;
}
const UPDATE_STOCK_DATA = (root, { stock }) => {
  //console.log({stock});
  let result =[];
  stock.map((item)=>{
    let stock_symbol = item.code;
    stock_market_data[stock_symbol] = item;
    result.push(item)
  });
 // const newMessage = { id: String(nextMessageId++), content: message };
 // pubsub.publish(CHANNEL, { messageAdded: newMessage });
  //console.log(stock_market_data);
  return result;
}

const resolvers = {
  Query: {
    STOCK_DATA: STOCK_DATA,
  },
  Mutation: {
    UPDATE_STOCK_DATA: UPDATE_STOCK_DATA,
  },
  Subscription: {
    LISTEN_STOCK: {
      subscribe: () => pubsub.asyncIterator(CHANNEL),
    },
  },
};

export default resolvers;
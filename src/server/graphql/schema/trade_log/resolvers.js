import fs from 'fs';
import csv from 'csv';
import { PubSub,withFilter } from 'graphql-subscriptions';

import {HOLD_TABLE_FILE_PATH, CLEARENCE_TABLE_FILE_PATH } from '../../../route/api/tradelog';



const pubsub = new PubSub();
const CHANNEL = "TRADE_LOG_DATA";
let stock_market_data = {};


let foo = function(filepath,result) {
  return new Promise((resolve,reject) => {
    let result =[]
    fs.createReadStream(HOLD_TABLE_FILE_PATH)
    .pipe(csv.parse({columns: true}))
    .on('data', function (data) {
       // console.log(data,'------------------');
        if(data.id != '') {
          result.push(data);
        }
      }).on('end',;
      resolve(result);
  });
};

const HOLD_TABLE = async (root, args, ctx, info) =>{
  //console.log("ARGS",args);
  let result_list =[];
    let a = await(foo(HOLD_TABLE_FILE_PATH));

   
      
    console.log(a,result_list);
    return a;
};

const CLEARENCE_TABLE = (root, args, ctx, info) =>{
  //console.log("ARGS",args);
  let result_list =[];
  args.symbol_list.map((symbol)=>{
    if(stock_market_data[symbol]){
      result_list.push(stock_market_data[symbol]);
    }
  });
  return result_list;
};



const resolvers = {
  Query: {
    HOLD_TABLE: HOLD_TABLE,
    CLEARENCE_TABLE: CLEARENCE_TABLE
  },
  Mutation: {

  },
  Subscription: {
    
  },
};

export default resolvers;
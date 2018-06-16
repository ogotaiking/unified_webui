const  Stock_Trade_Log_Type = `

type HOLD_TradeLog_Type {
  id: String!
  symbol: String
  name: String
  trade_date: String
  trade_price: Float
  volume: Float
  total_money: Float
}

type CLEARENCE_TradeLog_Type {
  id: String!
  symbol: String
  name: String
  trade_date: String
  trade_price: Float
  volume: Float
  total_money: Float
}


input TradeLog_INPUT {
  id: String!
  symbol: String
  name: String
  trade_date: String
  trade_price: Float
  volume: Float
  total_money: Float
}

type OPERATION_LOG {
  NUMBER : Int
  OK     : Boolean
}

type Query {
  HOLD_TABLE: [HOLD_TradeLog_Type!]!
  HOLD_TABLE_SUMMARY: [HOLD_TradeLog_Type!]!
  HOLD_STOCK_LIST:[String!]!
  CLEARENCE_TABLE: [CLEARENCE_TradeLog_Type!]!
  CLEARENCE_STOCK_LIST:[String!]!
  TRADING_DAY(num: Int):[String!]!
}
type Mutation {
  UPDATE_HOLD_TABLE: [HOLD_TradeLog_Type!]!
  REMOVE_HOLD_TABLE_ITEM(id: [String!]!): OPERATION_LOG
  UPDATE_CLEARENCE_TABLE: [CLEARENCE_TradeLog_Type!]!
  REMOVE_CLEARENCE_TABLE_ITEM(id: [String!]!): OPERATION_LOG
}
type Subscription {
  HOLD_TABLE: [HOLD_TradeLog_Type!]!
  CLEARENCE_TABLE: [CLEARENCE_TradeLog_Type!]!
}


`;

export default Stock_Trade_Log_Type;


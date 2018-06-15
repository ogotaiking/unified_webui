const  Stock_Trade_Log_Type = `

type TradeLog_Type {
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
  HOLD_TABLE: [TradeLog_Type!]!
  HOLD_TABLE_SUMMARY: [TradeLog_Type!]!
  HOLD_STOCK_LIST:[String!]!
  CLEARENCE_TABLE: [TradeLog_Type!]!
  CLEARENCE_STOCK_LIST:[String!]!
  TRADING_DAY(num: Int):[String!]!
}
type Mutation {
  UPDATE_HOLD_TABLE: [TradeLog_Type!]!
  REMOVE_HOLD_TABLE_ITEM(id: [String!]!): OPERATION_LOG
  UPDATE_CLEARENCE_TABLE: [TradeLog_Type!]!
}
type Subscription {
  HOLD_TABLE: [TradeLog_Type!]!
  CLEARENCE_TABLE: [TradeLog_Type!]!
}


`;

export default Stock_Trade_Log_Type;


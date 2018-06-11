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

type Query {
  HOLD_TABLE: [TradeLog_Type!]!
  HOLD_TABLE_SUMMARY: [TradeLog_Type!]!
  HOLD_STOCK_LIST:[String!]!
  CLEARENCE_TABLE: [TradeLog_Type!]!
  CLEARENCE_STOCK_LIST:[String!]!
}
type Mutation {
  UPDATE_HOLD_TABLE: [TradeLog_Type!]!
  UPDATE_CLEARENCE_TABLE: [TradeLog_Type!]!
}
type Subscription {
  HOLD_TABLE: [TradeLog_Type!]!
  CLEARENCE_TABLE: [TradeLog_Type!]!
}
`;

export default Stock_Trade_Log_Type;


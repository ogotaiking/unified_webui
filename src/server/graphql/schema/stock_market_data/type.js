const  Stock_Market_Data_Type = `

type StockType {
  symbol: String!
  stockname: String
  currentdate: String
  currenttime: String
  current: Float
  pricechange: Float
  pctchange: Float
  open: Float
  high: Float
  low: Float
  lastclose: Float
  buy: Float
  sell: Float
  orderbook: OrderBook
  volm: Float
  voln: Int
}

input StockType_INPUT {
  symbol: String!
  stockname: String!
  currentdate: String
  currenttime: String
  current: Float
  open: Float
  high: Float
  low: Float
  lastclose: Float
  buy: Float
  sell: Float
  orderbook: OrderBook_INPUT
  volm: Float
  voln: Int
}

type OrderBook {
    buy:OrderQueue
    sell:OrderQueue
}

input OrderBook_INPUT {
  buy:OrderQueue_INPUT
  sell:OrderQueue_INPUT
}

type OrderQueue {
  price:[Float!]!
  volume:[Int]
}

input OrderQueue_INPUT {
  price:[Float]
  volume:[Int]
}

type StockIndex_Type {
  symbol: String!
  stockname: String
  current: Float
  pricechange: Float
  pctchange: Float
  volm: Float
  voln: Float
}

input StockIndex_INPUT {
  symbol: String!
  stockname: String
  current: Float
  pricechange: Float
  pctchange: Float
  volm: Float
  voln: Float
}



type Query {
  STOCK_DATA(symbol_list:[String!]!): [StockType!]!
  STOCK_INDEX_DATA(symbol_list:[String!]!): [StockIndex_Type!]!
}
type Mutation {
  UPDATE_STOCK_DATA(stock: [StockType_INPUT!]!): [StockType]
  UPDATE_STOCK_INDEX_DATA(stock: [StockIndex_INPUT!]!): [StockIndex_Type]
}
type Subscription {
  STOCK_DATA(symbol_list:[String!]!): StockType!
  STOCK_INDEX_DATA(symbol_list:[String!]!): StockIndex_Type!
}
`;

export default Stock_Market_Data_Type;


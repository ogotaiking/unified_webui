const  Stock_Market_Data_Type = `
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
input OrderBook_INPUT {
  buy:OrderQueue_INPUT
  sell:OrderQueue_INPUT
}

input OrderQueue_INPUT {
  price:[Float]
  volume:[Int]
}

type StockType {
  symbol: String!
  stockname: String
  currentdate: String
  currenttime: String
  current: Float
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

type OrderBook {
    buy:OrderQueue
    sell:OrderQueue
}

type OrderQueue {
  price:[Float!]!
  volume:[Int]
}

type Query {
  STOCK_DATA(symbol_list:[String!]!): [StockType!]!
}
type Mutation {
  UPDATE_STOCK_DATA(stock: [StockType_INPUT!]!): [StockType]
}
type Subscription {
  LISTEN_STOCK_DATA: [StockType!]!
  LISTEN_STOCK_DATA_BY_SYMBOL_LIST(symbol_list:[String!]!): [StockType!]!
}
`;

export default Stock_Market_Data_Type;

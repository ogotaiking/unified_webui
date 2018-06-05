const Stock_HQ_Type = `
input StockType_INPUT {
    code: String!
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
  code: String!
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
  LISTEN_STOCK_DATA_BY_CODELIST(code:[String!]!): [StockType!]!
}
`;

export default Stock_HQ_Type;

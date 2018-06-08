import gql from 'graphql-tag';

export const STOCK_DATA_QUERY = gql`query STOCK_DATA_QUERY($symbol_list:[String!]!){
    STOCK_DATA(symbol_list: $symbol_list){
      id
      stockname
      current
      currenttime
      pricechange
      pctchange
      high
      low
      volm
    }
}`;

export const STOCK_DATA_MUTATION = gql`mutation STOCK_DATA_MUTATION($data: [StockType_INPUT!]!){
    UPDATE_STOCK_DATA(stock: $data) 
    {
      id
      stockname
      current
      currenttime
      pricechange
      pctchange
      high
      low
      volm
    }
}`;

export const STOCK_DATA_SUBSCRIPTION = gql`subscription STOCK_DATA_SUBSCRIPTION($symbol_list: [String!]!){
    STOCK_DATA(symbol_list: $symbol_list ){
      id
      stockname
      current
      currenttime
      pricechange
      pctchange
      high
      low
      volm
    }
}`;

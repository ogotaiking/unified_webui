import gql from 'graphql-tag';

export const STOCK_INDEX_DATA_QUERY =gql`query STOCK_INDEX_DATA_QUERY($symbol_list:[String!]!){
    STOCK_INDEX_DATA(symbol_list: $symbol_list){
      id
      stockname
      current
      pricechange
      pctchange
      volm
    }
}`;

export const STOCK_INDEX_DATA_MUTATION = gql`mutation STOCK_INDEX_DATA_MUTATION($data: [StockIndex_INPUT!]!){
    UPDATE_STOCK_INDEX_DATA(stock: $data) 
    {
      id
      stockname
      current
      pricechange
      pctchange
      volm
    }
}`;

export const STOCK_INDEX_DATA_SUBSCRIPTION = gql`
subscription STOCK_INDEX_DATA_SUBSCRIPTION($symbol_list: [String!]!){
    STOCK_INDEX_DATA(symbol_list: $symbol_list ){
        id
        stockname
        current
        pricechange
        pctchange
        volm
    }
}`;
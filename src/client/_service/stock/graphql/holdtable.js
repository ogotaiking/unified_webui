import gql from 'graphql-tag';

export const STOCK_HOLD_TABLE_QUERY =gql`query{
  HOLD_STOCK_LIST
    HOLD_TABLE{
      id
      name
      symbol
      trade_price
      volume
      total_money
      trade_date      
      }
}`;

export const STOCK_HOLD_TABLE_SUMMARY_QUERY =gql`query {
  HOLD_STOCK_LIST
  HOLD_TABLE_SUMMARY{
    id
    name
    symbol
    trade_price
    volume
    total_money
    trade_date      
    }
}`;


export const STOCK_NEED_CLEARENCE_TABLE_QUERY =gql`query STOCK_NEED_CLEARENCE_TABLE_QUERY($max_hold_day: Int!){
  TRADING_DAY(num: $max_hold_day)
  HOLD_STOCK_LIST
  HOLD_TABLE{
    id
    name
    symbol
    trade_price
    volume
    total_money
    trade_date      
    }
}`;

export const STOCK_HOLD_STOCK_LIST =gql`query{
  HOLD_STOCK_LIST}`;


export const STOCK_HOLD_TABLE_MUTATION_DELETE = gql`mutation REMOVE_HOLD_TABLE_ITEM($data: [String!]!){
    REMOVE_HOLD_TABLE_ITEM(id: $data) 
    {
      NUMBER
      OK
    }
}`;


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

export const STOCK_HOLD_TABLE_SUMMARY_QUERY =gql`query{
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

export const STOCK_HOLD_STOCK_LIST =gql`query{
  HOLD_STOCK_LIST}`;


export const STOCK_HOLD_TABLE_MUTATION_DELETE = gql`mutation HOLD_TABLE_DELETE($data: [String!]!){
    HOLD_TABLE_DELETE(id_list: $data) 
    {
      id
      name
      symbol
      trade_price
      volume
      total_money
      trade_date
    }
}`;
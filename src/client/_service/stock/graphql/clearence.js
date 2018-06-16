import gql from 'graphql-tag';

export const STOCK_CLEARENCE_TABLE_QUERY =gql`query{
    CLEARENCE_STOCK_LIST
    CLEARENCE_TABLE{
        id
        name
        symbol
        trade_price
        volume
        total_money
        trade_date      
        }
  }`;

export const STOCK_CLEARENCE_STOCK_LIST =gql`query{
    CLEARENCE_STOCK_LIST
}`;
  
  
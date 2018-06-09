import gql from 'graphql-tag';

export const STOCK_DATA_QUERY = gql `query STOCK_DATA_QUERY($symbol_list:[String!]!){
    STOCK_DATA(symbol_list: $symbol_list)
    {
      id
      stockname
      currentdate
      currenttime
      current
      pricechange
      pctchange
      open
      high
      low
      lastclose
      buy
      sell
      volm
      voln
      orderbook {
        buy {
          price
          volume
        }
        sell{
          price
          volume
        }
      }
    }
}`;

export const STOCK_DATA_MUTATION = gql `mutation STOCK_DATA_MUTATION($data: [StockType_INPUT!]!){
    UPDATE_STOCK_DATA(stock: $data) 
    {
      id
      stockname
      currentdate
      currenttime
      current
      pricechange
      pctchange
      open
      high
      low
      lastclose
      buy
      sell
      volm
      voln
      orderbook {
        buy {
          price
          volume
        }
        sell{
          price
          volume
        }
      }
    }
}`;

export const STOCK_DATA_SUBSCRIPTION = gql `subscription STOCK_DATA_SUBSCRIPTION($symbol_list: [String!]!){
    STOCK_DATA(symbol_list: $symbol_list )
    {
      id
      stockname
      currentdate
      currenttime
      current
      pricechange
      pctchange
      open
      high
      low
      lastclose
      buy
      sell
      volm
      voln
      orderbook {
        buy {
          price
          volume
        }
        sell{
          price
          volume
        }
      }
    }
}`;
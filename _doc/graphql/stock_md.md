行情更新Mutation

```graphql
mutation {
  UPDATE_STOCK_DATA(stock: [{
    code: "sz300104"
    stockname: "乐视网"
    currentdate: "2018-01-01"
    currenttime: "13:44:55"
    current: 3.14
    open: 3.22
    high: 3.55
    low: 3.01
    lastclose: 3.11
    buy: 3.13
    sell: 3.15
    orderbook: {
      buy: {
        price:[3.09,3.10,3.11,3.12,3.13]
        volume: [10,10,10,10,10]
      } 
      sell: {
        price:[3.15,3.16,3.17,3.18,3.19]
        volume: [10,10,10,10,10]
      }
    }
    volm: 4123123.33
    voln: 40000
  },{
    code: "sz000001"
    stockname: "平安银行"
    currentdate: "2018-01-01"
    currenttime: "13:44:55"
    current: 3.14
    open: 4.22
    high: 4.55
    low: 3.01
    lastclose: 4.11
    buy: 3.13
    sell: 3.15
    orderbook: {
      buy: {
        price:[3.09,3.10,3.11,3.12,3.13]
        volume: [10,10,10,10,10]
      } 
      sell: {
        price:[3.15,3.16,3.17,3.18,3.19]
        volume: [10,10,10,10,10]
      }
    }
    volm: 4123123.33
    voln: 40000   
  }]) {
    stockname  
  }
}
```
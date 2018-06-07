import React from 'react';
import { graphql } from 'react-apollo';
import { Spin, Alert }  from 'antd';
import  gql  from 'graphql-tag';
import LoadingBox from '../../../../component/util/loadingbox';
import ErrorBox from '../../../../component/util/errorbox';
import Table from '../table/hold_table';


class StockTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            market_data : new Map()
        };
    }


    static getDerivedStateFromProps(nextProp,prevState) {
        //console.log('DerivedStateFunction:',prevState.market_data.size,nextProp.stockQuery.STOCK_DATA);
        if ( (prevState.market_data.size == 0 ) && (nextProp.stockQuery.STOCK_DATA) ) {
            let result = new Map();
            nextProp.hold_data.map((item)=>{
                result.set(item.symbol,item);
            });
            nextProp.stockQuery.STOCK_DATA.map((orig_item)=> {
                let item = {...orig_item};
                item.buy_date = result.get(item.symbol).buy_date;
                item.hold_vol = result.get(item.symbol).hold_vol;
                item.total_money = result.get(item.symbol).total_money;
                item.hold_price = (item.total_money / item.hold_vol).toFixed(2);
                item.cum_pctchange = ((item.current - item.hold_price)*100.0 / item.hold_price).toFixed(2);
                item.earn = (item.current * item.hold_vol - item.total_money).toFixed(2);
                result.set(item.symbol,item);
                //console.log("Derived:",item);
            });
            return { market_data: result};
        } else {
            return null;
        }
    }


    componentDidMount(){
        this._subscribeData(this.props.hold_data.map((item)=>{return item.symbol;}),this.state.market_data);
    }

    _DataToRender = () => {
        //console.log('Renderfunction called....');
        return [...this.state.market_data.values()];
    }

    _subscribeData = (symbol_list) => {
        this.props.stockQuery.subscribeToMore({
            document: gql`
                subscription stockIndex($symbol_list: [String!]!){
                    STOCK_DATA(symbol_list: $symbol_list ){
                        symbol
                        stockname
                        current
                        currenttime
                        pricechange
                        pctchange
                        high
                        low
                        volm
                    }
                }`,
            variables: { 
                symbol_list 
            },
            updateQuery: (previous, { subscriptionData}) => {
                let item = subscriptionData.data.STOCK_DATA;
                let result_map = this.state.market_data;
                
                if (result_map.get(item.symbol)) {
                    item.buy_date = result_map.get(item.symbol).buy_date;
                    item.hold_vol = result_map.get(item.symbol).hold_vol;
                    item.total_money = result_map.get(item.symbol).total_money;
                    item.hold_price = result_map.get(item.symbol).hold_price;
                    item.cum_pctchange = ((item.current - item.hold_price)*100.0 / item.hold_price).toFixed(2);
                    item.earn = (item.current * item.hold_vol - item.total_money).toFixed(2);   
                }
                //console.log("DATA",result_map,item);

                result_map.set(item.symbol,item);
                this.setState({market_data: result_map});
                //return null;
            },
        });
  }

  render() {
    if (this.props.stockQuery && this.props.stockQuery.loading) {
      return <LoadingBox/>;
    }

    if (this.props.stockQuery && this.props.stockQuery.error) {
      return  <ErrorBox title={this.props.stockQuery.error.toString()} 
                     message={'['+this.props.chartname +']:获取数据错误'} 
              />;
    }

    const DataToRender = this._DataToRender();
    let sum_money = 0.0;
    let sum_ratio = 0.0;
    let sum_earn = 0.0;
    if (DataToRender.length > 0) {
        DataToRender.map((item)=>{
            sum_money = sum_money + parseFloat(item.total_money);
            sum_earn = sum_earn + parseFloat(item.earn);
        });
        sum_ratio = (sum_earn/sum_money * 100).toFixed(3);
    }
    const columns = [{
        title: '股票代码',
        dataIndex: 'symbol',
      }, {
        title: '股票名称',
        dataIndex: 'stockname',
      }, {
        title: '持仓数量',
        dataIndex: 'hold_vol',
      }, {
        title: '累计盈亏%',
        dataIndex: 'cum_pctchange',
      }, {          
        title: '成本价',
        dataIndex: 'hold_price',
      }, {                         
        title: '现价',
        dataIndex: 'current',
      }, {
        title: '涨跌',
        dataIndex: 'pricechange',
      }, {
        title: '今日涨跌幅',
        dataIndex: 'pctchange',
      }, {
        title: '最高',
        dataIndex: 'high',
      }, {
        title: '最低',
        dataIndex: 'low',
      }, {
        title: '累计盈亏',
        dataIndex: 'earn',
      }];

    return (
       <Table chartname={this.props.chartname} 
              rowKey={DataToRender => DataToRender.symbol} 
              dataSource={DataToRender} 
              columns={columns}   
              sum_money={sum_money}
              sum_ratio={sum_ratio}
              sum_earn={sum_earn}
              />
    );
 }
}

export const STOCK_QUERY = gql`
query StockQuery($symbol_list:[String!]!){
    STOCK_DATA(symbol_list: $symbol_list){
      symbol
      stockname
      current
      currenttime
      pricechange
      pctchange
      high
      low
      volm
    }
  }
`;


export default graphql(STOCK_QUERY, {
  name: 'stockQuery',
  options: ownProps => {
    const symbol_list = ownProps.hold_data.map((item)=>{return item.symbol;});
    return {
      variables: {
        symbol_list
     },
    };
   },
  cachePolicy: { query: true, data: false } 
})(StockTable);
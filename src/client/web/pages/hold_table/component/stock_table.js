import React from 'react';
import { graphql } from 'react-apollo';
import { Spin, Table,Alert }  from 'antd';
import  gql  from 'graphql-tag';
import LoadingBox from '../../../component/util/loadingbox';
import ErrorBox from '../../../component/util/errorbox';


class StockTable extends React.Component {
    componentDidMount(){
        this._subscribeData(this.props.symbol_list.map((item)=>{ return item.split("_")[1];}));
    }
    _DataToRender = () => {
        return this.props.stockQuery.STOCK_INDEX_DATA;
    }

    _subscribeData = (symbol_list) => {
        this.props.stockQuery.subscribeToMore({
            document: gql`
                subscription stockIndex($symbol_list: [String!]!){
                    STOCK_DATA(symbol_list: $symbol_list ){
                      symbol
                      stockname
                      currentdate
                      currenttime
                      current
                      lastclose
                      high
                      low
                      volm
                      voln
                      buy
                      sell
                    }
                }`,
                variables: { 
                    symbol_list 
                },
                updateQuery: (previous, { subscriptionData}) => {
                    //console.log("PREV",previous.STOCK_INDEX_DATA);
                    //console.log("SubScription",subscriptionData.data.STOCK_INDEX_DATA); 

                    let fetch_result = subscriptionData.data.STOCK_INDEX_DATA;
                    let result_map = new Map();
                    previous.STOCK_INDEX_DATA.map((item)=>{
                        result_map.set(item.symbol,item);
                    });

                    fetch_result.map((item)=>{
                        result_map.set(item.symbol,item);
                    });

                    let result_array = [...result_map.values()];
                    //console.log(result_array);
                    let resultData = { 
                              ...previous,
                              STOCK_INDEX_DATA: result_array
                            };
                    //console.log("RESULT",resultData);
                return resultData;
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
    const columns = [{
        title: '指数名称',
        dataIndex: 'stockname',
      }, {
        title: '当前点位',
        dataIndex: 'current',
      }, {
        title: '涨跌',
        dataIndex: 'pricechange',
      }, {
        title: '涨跌幅',
        dataIndex: 'pctchange',
      }, {
        title: '成交金额（万元）',
        dataIndex: 'volm',
      }];

    return (
       <Table rowKey={DataToRender => DataToRender.symbol} 
              dataSource={DataToRender} 
              columns={columns} size="small" pagination={false} />
    );
 }
}

export const STOCK_QUERY = gql`
query StockQuery($symbol_list:[String!]!){
    STOCK_DATA(symbol_list: $symbol_list){
      symbol
      stockname
      currentdate
      currenttime
      current
      lastclose
      high
      low
      volm
      voln
      buy
      sell
    }
  }
`;


export default graphql(STOCK_QUERY, {
  name: 'stockQuery',
  options: ownProps => {
    const symbol_list = ownProps.symbol_list;
    return {
      variables: {
        symbol_list
     },
    };
   },
  cachePolicy: { query: true, data: false } 
})(StockTable);
import React from 'react';
import { graphql } from 'react-apollo';
import { Spin, Alert }  from 'antd';
import  gql  from 'graphql-tag';
import LoadingBox from '../../../../component/util/loadingbox';
import ErrorBox from '../../../../component/util/errorbox';
import Table from '../table/stock_table';


class StockTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            market_data : new Map()
        };
    }
    static getDerivedStateFromProps(nextProp,prevState) {
        //console.log('DerivedStateFunction:',prevState.market_data.size,nextProp.stockQuery.STOCK_INDEX_DATA);
        if ( (prevState.market_data.size == 0 ) && (nextProp.stockQuery.STOCK_INDEX_DATA) ) {
            let result = new Map();
            nextProp.stockQuery.STOCK_DATA.map((item)=> {
                result.set(item.symbol,item);
            });
            return { market_data: result};
        } else {
            return null;
        }
    }


    componentDidMount(){
        this._subscribeData(this.props.symbol_list);
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
    const columns = [{
        title: '股票代码',
        dataIndex: 'symbol',
      }, {
        title: '股票名称',
        dataIndex: 'stockname',
      }, {
        title: '现价',
        dataIndex: 'current',
      }, {
        title: '涨跌',
        dataIndex: 'pricechange',
      }, {
        title: '涨跌幅',
        dataIndex: 'pctchange',
      }, {
        title: '最高',
        dataIndex: 'high',
      }, {
        title: '最低',
        dataIndex: 'low',
      }, {          
        title: '成交金额（万元）',
        dataIndex: 'volm',
      }, {
        title: 'Time',
        dataIndex:'currenttime'
      }];

    return (
       <Table chartname={this.props.chartname} 
              rowKey={DataToRender => DataToRender.symbol} 
              dataSource={DataToRender} 
              columns={columns}   />
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
    const symbol_list = ownProps.symbol_list;
    return {
      variables: {
        symbol_list
     },
    };
   },
  cachePolicy: { query: true, data: false } 
})(StockTable);
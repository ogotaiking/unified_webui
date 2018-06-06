import React from 'react';
import { graphql } from 'react-apollo';
import { Spin, Table,Alert }  from 'antd';
import  gql  from 'graphql-tag';
import LoadingBox from '../../../component/util/loadingbox';
import ErrorBox from '../../../component/util/errorbox';


class StockTable extends React.Component {
  _historyLogToRender = () => {
    return this.props.stockQuery.STOCK_DATA;
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

    const historyLogToRender = this._historyLogToRender();
    const columns = [{
        title: '用户名',
        dataIndex: 'stockname',
        width: '10%',
      }, {
        title: '登陆日期',
        dataIndex: 'current',
        width: '15%',
      }, {
        title: 'IP',
        dataIndex: 'high',
        width: '20%',
      }, {
        title: '登陆地点',
        dataIndex: 'low',
        width: '15%'
      }, {
        title: '运营商',
        dataIndex: 'volm',
        width: '10%'
      }, {
        title: 'User-Agent',
        dataIndex: 'voln',
      }];

    return (
       <Table rowKey={historyLogToRender => historyLogToRender.symbol} 
              dataSource={historyLogToRender} 
              columns={columns} />
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
      high
      low
      volm
      voln
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
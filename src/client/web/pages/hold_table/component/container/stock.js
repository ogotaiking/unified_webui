import React from 'react';
import Table from '../table/stock_table';

class StockTable extends React.Component { 
  constructor(props){
    super(props);
  }

  _DataToRender = () => {
    //console.log('Renderfunction called....');
    let result=[];
    this.props.symbol_list.map((item)=>{
        let data = this.props.market_data.get(item);
        if (data) {
          result.push(data);
        }        
    });
    return result;
  }
  render() {
    const DataToRender = this._DataToRender();
    const columns = [{
        title: '股票代码',
        dataIndex: 'id',
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
        title: '开盘价',
        dataIndex: 'open',        
      }, {
        title: '昨收',
        dataIndex: 'lastclose',        
      }, {
        title: '最高',
        dataIndex: 'high',
      }, {
        title: '最低',
        dataIndex: 'low',
      }, {
        title: '买入价',
        dataIndex: 'buy',
      }, {
        title: '卖出价',
        dataIndex: 'sell',        
      }, {          
        title: '成交金额（万元）',
        dataIndex: 'volm',
      }, {
        title: 'Time',
        dataIndex:'currenttime'
      }];

    return (
       <Table chartname={this.props.chartname} 
              rowKey={DataToRender => DataToRender.id} 
              dataSource={DataToRender} 
              columns={columns}   />
    );
 }
}
export default StockTable;
import React from 'react';
import Table from '../table/stock_table';
import { Responsive_Column_Filter } from '../../util/responsive_view';

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
    const Display_Columns = [{
        title: '股票代码',
        dataIndex: 'id',
        display_priority: 1
      }, {
        title: '股票名称',
        dataIndex: 'stockname',
        display_priority: 1
      }, {
        title: '现价',
        dataIndex: 'current',
        display_priority: 1
      }, {
        title: '涨跌',
        dataIndex: 'pricechange',
        display_priority: 2
      }, {
        title: '涨跌幅',
        dataIndex: 'pctchange',
        display_priority: 1
      }, {
        title: '开盘价',
        dataIndex: 'open', 
        display_priority: 2       
      }, {
        title: '昨收',
        dataIndex: 'lastclose',        
        display_priority: 2
      }, {
        title: '最高',
        dataIndex: 'high',
        display_priority: 2
      }, {
        title: '最低',
        dataIndex: 'low',
        display_priority: 2
      }, {
        title: '买入价',
        dataIndex: 'buy',
        display_priority: 3
      }, {
        title: '卖出价',
        dataIndex: 'sell', 
        display_priority: 3       
      }, {          
        title: '成交金额（万元）',
        dataIndex: 'volm',
        display_priority: 2
      }, {
        title: 'Time',
        dataIndex:'currenttime',
        display_priority: 2
      }];

    let columns = Responsive_Column_Filter(Display_Columns);
    return (
       <Table chartname={this.props.chartname} 
              rowKey={DataToRender => DataToRender.id} 
              dataSource={DataToRender} 
              columns={columns}   />
    );
 }
}
export default StockTable;
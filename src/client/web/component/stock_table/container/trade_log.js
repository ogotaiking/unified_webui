import React from 'react';
//import Table from '../table/stock_table';
import Table from '../table/edit_hold_table';

class TradeLogTable extends React.Component { 
  constructor(props){
    super(props);
  }

  _DataToRender = () => {
    return [...this.props.trade_log];
  }
  render() {
    const DataToRender = this._DataToRender();
    const columns = [{
    
        title: '股票代码',
        dataIndex: 'symbol',
      }, {
        title: '股票名称',
        dataIndex: 'name',
      }, {
        title: '交易数量',
        dataIndex: 'volume',
      }, {
        title: '交易均价',
        dataIndex: 'trade_price',
      }, {
        title: '交易金额',
        dataIndex: 'total_money',
      }, {      
        title: '交易日期',
        dataIndex: 'trade_date',
      }];

    return (
       <Table chartname={this.props.chartname} 
              rowKey={DataToRender => DataToRender.id} 
              dataSource={DataToRender} 
              columns={columns}   />
    );
 }
}
export default TradeLogTable;
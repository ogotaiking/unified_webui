import React from 'react';
import Table from '../table/stock_table';
import { Responsive_Column_Filter } from '../../util/responsive_view';

class TradeLogTable extends React.Component { 
  constructor(props){
    super(props);
  }

  _DataToRender = () => {
    return [...this.props.trade_log];
  }
  render() {
    const DataToRender = this._DataToRender();
    const Display_Columns = [{
        title: '股票代码',
        dataIndex: 'symbol',
        display_priority: 1
      }, {
        title: '股票名称',
        dataIndex: 'name',
        display_priority: 1
      }, {
        title: '交易数量',
        dataIndex: 'volume',
        display_priority: 1
      }, {
        title: '交易均价',
        dataIndex: 'trade_price',
        display_priority: 1
      }, {
        title: '交易金额',
        dataIndex: 'total_money',
        display_priority: 2
      }, {      
        title: '日期',
        dataIndex: 'trade_date',
        display_priority: 3
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
export default TradeLogTable;
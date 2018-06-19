import React from 'react';
import Table from '../table/stock_table';
import { Responsive_Column_Filter } from '../../util/responsive_view';

class IndexTable extends React.Component {
    constructor(props){
        super(props);
    }

    _DataToRender = () => {
        //console.log('Renderfunction called....');
        //console.log(this.props.symbol_list,this.props.market_data);
        let result=[];
        this.props.symbol_list.map((item)=>{
            let short_symbol = item.split("_")[1];
            let data = this.props.market_data.get(short_symbol);
            if (data) {
              result.push(data);
            }        
        });
        return result;
      }

  render() {
    const DataToRender = this._DataToRender();
    const Display_Columns = [{
        title: '指数名称',
        dataIndex: 'stockname',
        display_priority: 1,        
        style:{
            width: '20%'
        }
      }, {
        title: '当前点位',
        dataIndex: 'current',
        display_priority: 1,
        style:{
            width: '20%'
        }
      }, {
        title: '涨跌',
        display_priority: 2,
        dataIndex: 'pricechange',
        style:{
            width: '20%'
        }        
      }, {
        title: '涨跌幅',
        display_priority: 1,
        dataIndex: 'pctchange',
        style:{
            width: '15%'
        }
      }, {
        title: '成交金额（亿）',
        dataIndex: 'volm',
        display_priority: 2,
        style:{
            width: '25%'
        }        
      }];
    let columns = Responsive_Column_Filter(Display_Columns);

    return (
       <Table chartname={this.props.chartname} 
              rowKey={DataToRender => DataToRender.id} 
              dataSource={DataToRender} 
              columns={columns} />
    );
 }
}

export default IndexTable;
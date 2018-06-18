import React from 'react';
import {CSVLink} from 'react-csv';
import {Icon ,Checkbox,Button} from 'antd';
import {graphql ,withApollo} from 'react-apollo';
import { STOCK_HOLD_TABLE_MUTATION_DELETE } from '../../../../_service/stock/graphql/holdtable';
import './table.scss';

class EditHoldTradeLogTable extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            checkedList: [],
            indeterminate: false,
            checkAll: false,
        };
        this.onChangeItem = this.onChangeItem.bind(this);
        this.onCheckAllChange = this.onCheckAllChange.bind(this);
        this.editTradeLog = this.editTradeLog.bind(this);
    }

    _parseTableHeader() {
        let header = this.props.columns;
        return (       
            header.map((item,key)=>{
                if (item.style) {
                    return (<th key={key} style={item.style}>{item.title}</th>);
                } else {
                    return (<th key={key} >{item.title}</th>);
                }
            })
        );
    }

    _parseCellData(data,columns,key){
       return columns.map((col,key)=>{
            return ( <td key={key}>{data[col.dataIndex]}</td> );
            /*
            if (typeof(value)== "string") {
                return (<td key={key} className="string">{data[col.dataIndex]}</td> );
            } else {
                return ( <td key={key}>{value}</td> );
            }*/
        });
    }



    onChangeItem = (checkedList) => {
        const all_data_key_list = this.props.dataSource.map((item)=>{return item.id;});
        this.setState({
          checkedList,
          indeterminate: !!checkedList.length && (checkedList.length < all_data_key_list.length),
          checkAll: checkedList.length === all_data_key_list.length,
        });
    }
    
    onCheckAllChange = (e) => {
        const all_data_key_list = this.props.dataSource.map((item)=>{return item.id;});
        this.setState({
          checkedList: e.target.checked ? all_data_key_list : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
      }

    _parseRowData(data,columns,key) {    
        let tdContent = this._parseCellData(data,columns,key);
        const select_stock = this.state.checkedList;
        if (select_stock.indexOf(data.id)>-1) {
            return (
                <tr key={key} className="stoploss">
                
                <td key={data.id}><Checkbox value={data.id}/></td>
                <td key={data.id+'A'}>证券买入</td>
                {tdContent}
                </tr>
            );
        } else {
            return (
                <tr key={key}>
                <td key={data.id}><Checkbox value={data.id}/></td> 
                <td key={data.id+'A'}>证券买入</td>
                {tdContent}</tr>
                
            );
        }
        
   }

    _parseTableData() {
        let data = this.props.dataSource;
        let header = this.props.columns;
        if (data.length == 0) {
            const nodata_style = {
                fontStyle: 'bold',
                fontSize: '20px',
                height:'80px '
            };
            return (<tr><td colSpan={header.length+1} style={nodata_style}>No Data</td></tr>);
        } else {
            return (
                data.map((item,key)=>{
                    if (!this.props.rowKey) {
                        return this._parseRowData(item,this.props.columns,this.props.rowKey[key]);
                    } else {
                        return this._parseRowData(item,this.props.columns,key);
                    }
                })
            );
        }

      
    }
    _captionRender(chartname,dataSource) {
        if (!chartname) {
            return null;
        } else {
            return ( <caption>
                <i className="fa fa-signal"/><span style={{marginLeft: '5px'}}>{chartname}</span>
                <CSVLink data={dataSource} filename={chartname+'.csv'} style={{marginLeft: '5px'}} >
                    <Icon type="export" />
                    </CSVLink>
                    </caption>
            );
        }
    }
    editTradeLog(){
        //console.log('click delete button');
        this.props.delete_tradelog({
            variables: {
                id_list: this.state.checkedList
            }
        }).then((data)=>{
            //console.log('trigger...');
            this.props.refreshpage();
            //this.props.client.store.cache.data.delete('ROOT_MUTATION');
            //this.props.client.store.cache.data.delete('ROOT_QUERY');
            
        });
    }

    render() {
        const thContent = this._parseTableHeader();
        const DataContent = this._parseTableData();
        const captionContent = this._captionRender(this.props.chartname,this.props.dataSource);

        return (
            <div style={{textAlign:'right'}}>
                <Checkbox
                                        indeterminate={this.state.indeterminate}
                                        onChange={this.onCheckAllChange}
                                        checked={this.state.checkAll}
                                        >Select All</Checkbox>

                 <Checkbox.Group style={{ width: '100%' }} value={this.state.checkedList} onChange={this.onChangeItem}>
                     <table className="pt_table">
                             {captionContent}
                         <thead>
                            <tr>
                            <th key="action">Select</th>
                            <th key="action2">交易类型</th>
                                {thContent}

                             </tr>
                         </thead>
                         <tbody>
                         
                             {DataContent}                                                                       
                         </tbody>
                         <tfoot>
                            <tr>
                                <td colSpan={this.props.columns.length+2} style={{textAlign:'center', marginRight: '20px'}}>
                                    <Button type="danger" size="small" style={{width:'100%'}} onClick={this.editTradeLog}>删除已选择的交易记录</Button>
                                </td>
                            </tr>
                         </tfoot>
                     </table> 
                </Checkbox.Group>                     
             </div>           
        );
    }

}
export default graphql(STOCK_HOLD_TABLE_MUTATION_DELETE,{name: 'delete_tradelog'})(withApollo(EditHoldTradeLogTable));


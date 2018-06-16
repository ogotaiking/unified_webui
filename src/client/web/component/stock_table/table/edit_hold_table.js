import React from 'react';
import {CSVLink} from 'react-csv';
import {Icon ,Checkbox,Button} from 'antd';
import './table.scss';

class Table extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            select_log: []
        };
        this.onChange = this.onChange.bind(this);
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


    onChange(checkedValues){
        console.log("Select:"+checkedValues);
        this.setState({select_log: checkedValues});
    }

    _parseRowData(data,columns,key) {    
        let tdContent = this._parseCellData(data,columns,key);
        const select_stock = this.state.select_log;
        if (select_stock.indexOf(data.id)>-1) {
            return (
                <tr key={key} className="stoploss">
                 <td key={data.id}><Checkbox value={data.id}/></td>
                {tdContent}</tr>
            );
        } else {
            return (
                <tr key={key}>
                 <td key={data.id}><Checkbox value={data.id}/></td>
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
    render() {
        const thContent = this._parseTableHeader();
        const DataContent = this._parseTableData();
        const footContent = <tr><td colSpan={this.props.columns.length+1} style={{textAlign:'center', marginRight: '20px'}}><Button type="danger" size="small" style={{width:'100%'}}>删除已选择的交易记录</Button></td></tr>;
        const captionContent = this._captionRender(this.props.chartname,this.props.dataSource);

        return (
            <form>
            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
            <table className="pt_table">
                {captionContent}
                <thead>
                    <tr>
                        <th key="action">Select</th>
                        {thContent}
                    </tr>
                </thead>
                <tbody>
                    {DataContent}                                                                       
                </tbody>
                <tfoot>
                    {footContent}
                </tfoot>
            </table> 
            
            </Checkbox.Group>
            
            </form>
            
        );
    }

}

export default Table;

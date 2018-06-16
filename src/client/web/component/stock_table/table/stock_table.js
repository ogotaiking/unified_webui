import React from 'react';
import {CSVLink} from 'react-csv';
import {Icon } from 'antd';
import './table.scss';

class Table extends React.PureComponent{

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

    _rowStyle(val){
        let styleclass = null;
        switch(true) {
            case val > 9.5:
                styleclass = "up_stop";
                break;
            case ((val > 0.0) && (val<=9.5)):
                styleclass = "up";
                break;
            case ((val > -4.0) && (val < 0)):
                styleclass = "down";
                break;
            case ((val > -5.0) && (val <= -4.0)):
                styleclass = "stoploss_warn";
                break;
            case val < -5.0:
                styleclass = "stoploss";
                break;
            default:
                styleclass = null;
        }
        return styleclass;
    }

    _parseRowData(data,columns,key) {
        let styleclass = this._rowStyle(data.pctchange);       
        let tdContent = this._parseCellData(data,columns,key);
        if (styleclass != null) {
            return (
                <tr key={key} className={styleclass}>
                {tdContent}
                </tr>
            );
        } else {
            return (
                <tr key={key}>{tdContent}</tr>
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
            return (<tr><td colSpan={header.length} style={nodata_style}>No Data</td></tr>);
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



    render() {
        const thContent = this._parseTableHeader();
        const DataContent = this._parseTableData();
        const footContent = null;

        return (
            <table className="pt_table">
                <caption >
                <i className="fa fa-signal"/><span style={{marginLeft: '5px'}}>{this.props.chartname}</span>
                <CSVLink data={this.props.dataSource} filename={this.props.chartname+'.csv'} style={{marginLeft: '5px'}} >
                    <Icon type="export" />
                    </CSVLink>
                </caption>
                <thead>
                    <tr>
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
        );
    }

}

export default Table;

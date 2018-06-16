import React   from 'react';
import { Query } from 'react-apollo';
import {CSVLink} from 'react-csv';
import {Button} from 'antd';
import { STOCK_CLEARENCE_TABLE_QUERY } from '../../../_service/stock/graphql/clearence';
import StockSubWrap from '../../../_service/sina_market_data/md_sub/stock';
import TradeLogTable from '../../component/stock_table/container/trade_log';


import LoadingBox from '../../component/util/loadingbox';
import ErrorBox from '../../component/util/errorbox';

class ClearenceTableContainer extends React.Component{
    returnRenderJSX(data) {       
        let hash_map = new Map();
        if (data.CLEARENCE_TABLE instanceof Array) {
            data.CLEARENCE_TABLE.map((item)=>{
                let key = item.trade_date;
                let bucket = hash_map.get(key);
                let result_list = [];
                if (bucket) {
                    result_list = bucket;
                } 
                result_list.push(item);
                hash_map.set(key,result_list);
            });
        }

        let result_jsx = [];
        hash_map.forEach((value,key)=>{
            let chartname = key + "清仓";
            result_jsx.push(<TradeLogTable key={key} trade_log={value} chartname={chartname}/>);
        });

        //console.log(hash_map,result_jsx);

        return (  
                  <div style={{textAlign:'right'}}>
            <CSVLink data={data.CLEARENCE_TABLE} filename={"clearence.csv"} >
                <Button type="primary" icon="download" size="small" style={{marginBottom: '20px'}} >下载清仓数据表</Button>
            </CSVLink>
        <StockSubWrap symbol_list={data.CLEARENCE_STOCK_LIST}>
            {result_jsx.map((item)=>{return item;})}
        </StockSubWrap>
        </div>);
    }
    render() {
        return (
             <Query query={STOCK_CLEARENCE_TABLE_QUERY}  fetchPolicy="network-only">
                {({loading,error,data})=>{
                    if (loading) return  <LoadingBox/>;
                    if (error) return <ErrorBox title={error.toString()} 
                                        message={error.message} />;
                    return ( this.returnRenderJSX(data) );
                }}
            </Query>
        );
    } 
}
  
export default ClearenceTableContainer;

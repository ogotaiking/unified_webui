import React   from 'react';
import { Query } from 'react-apollo';
import { STOCK_HOLD_TABLE_QUERY } from '../../../../_service/stock/graphql/holdtable';
import StockSubWrap from '../../../../_service/sina_market_data/md_sub/stock';
import HoldTable from '../../../component/stock_table/container/hold';

import LoadingBox from '../../../component/util/loadingbox';
import ErrorBox from '../../../component/util/errorbox';

class HoldTableContainer extends React.Component{
    returnRenderJSX(data) {       
        let hash_map = new Map();
        if (data.HOLD_TABLE instanceof Array) {
            data.HOLD_TABLE.map((item)=>{
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
            let chartname = key + "持仓";
            result_jsx.push(<HoldTable key={key} hold_data={value} chartname={chartname}/>);
        });

        console.log(hash_map,result_jsx);
        return (  <StockSubWrap symbol_list={data.HOLD_STOCK_LIST}>
            {result_jsx.map((item)=>{return item;})}
        </StockSubWrap>);
    }
    render() {
        return (
             <Query query={STOCK_HOLD_TABLE_QUERY}>
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
  
export default HoldTableContainer;


import React   from 'react';
import { Query } from 'react-apollo';
import StockData from '../../../../_service/sina_market_data/md_fetch_agent/stock';
import { STOCK_HOLD_STOCK_LIST } from '../../../../_service/stock/graphql/holdtable';
import LoadingBox from '../../../component/util/loadingbox';
import ErrorBox from '../../../component/util/errorbox';

class HoldTableMarketData extends React.Component{
    returnRenderJSX(data,interval) {       
        let hash_grp_num = Math.round(data.length / 8);
        let hash_map = new Map();
        for (let i = 0; i < hash_grp_num; i++) {
            hash_map.set(i,[]);
        }
        if (data instanceof Array) {
            data.map((item)=>{
                let key = Math.floor(Math.random() * Math.floor(hash_grp_num));
                let bucket = hash_map.get(key);
                bucket.push(item);
                hash_map.set(key,bucket);
            });
        }
        //console.log(hash_map,data);
        let jsxresult= [...hash_map.values()].map((item,key)=>{
            return (<StockData key={key} symbol_list = {item} interval={interval}/> );

        });
        return jsxresult;
    }
    render() {
        const interval = this.props.interval;
        return (
             <Query query={STOCK_HOLD_STOCK_LIST}>
                {({loading,error,data})=>{
                    if (loading) return  <LoadingBox/>;
                    if (error) return <ErrorBox title={error.toString()} 
                                        message={error.message} />;
                    return ( this.returnRenderJSX(data.HOLD_STOCK_LIST,interval) );
                }}
            </Query>
        );
    } 
}
  
export default HoldTableMarketData;


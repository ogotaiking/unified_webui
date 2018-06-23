import React   from 'react';
import { Query } from 'react-apollo';
import { STOCK_NEED_CLEARENCE_TABLE_QUERY } from '../../../../_service/stock/graphql/holdtable';
import StockSubWrap from '../../../../_service/sina_market_data/md_sub/stock';
import HoldTable from '../../../component/stock_table/container/hold';


import LoadingBox from '../../../component/util/loadingbox';
import ErrorBox from '../../../component/util/errorbox';
import { MARKET_DATA } from '../../../config';


class NeedToClearenceTable extends React.Component{
    returnRenderJSX(data) {       
        return (  <StockSubWrap symbol_list={data.HOLD_STOCK_LIST} pollInterval={MARKET_DATA.query_pollInterval}>
            <HoldTable hold_data={data.HOLD_TABLE} trading_day={data.TRADING_DAY} chartname="需要卖出清算的表单" stoploss_rate={this.props.stoploss_rate} clearence_mode="true" max_hold_day={this.props.max_hold_day} />
        </StockSubWrap>);
    }
    //pollInterval={GRAPHQL_CONFIG.query_pollInterval} 
    render() {
        const query_var ={ max_hold_day: this.props.max_hold_day };
        return (
             <Query query={STOCK_NEED_CLEARENCE_TABLE_QUERY}  variables={query_var} fetchPolicy="network-only" >
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
  
export default NeedToClearenceTable;


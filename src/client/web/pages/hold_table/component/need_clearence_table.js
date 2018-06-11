import React   from 'react';
import { Query } from 'react-apollo';
import { STOCK_HOLD_TABLE_QUERY } from '../../../../_service/stock/graphql/holdtable';
import StockSubWrap from '../../../../_service/sina_market_data/md_sub/stock';
import HoldTable from '../../../component/stock_table/container/hold';

import LoadingBox from '../../../component/util/loadingbox';
import ErrorBox from '../../../component/util/errorbox';

class NeedToClearenceTable extends React.Component{
    returnRenderJSX(data) {       
        return (  <StockSubWrap symbol_list={data.HOLD_STOCK_LIST}>
            <HoldTable hold_data={data.HOLD_TABLE} chartname="需要卖出清算的表单" stoploss_rate={this.props.stoploss_rate} clearence_mode="true" max_hold_day={this.props.max_hold_day} />
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
  
export default NeedToClearenceTable;


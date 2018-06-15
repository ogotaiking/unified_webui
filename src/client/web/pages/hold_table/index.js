import React   from 'react';
import {withApollo} from 'react-apollo';
import Content from '../../component/layout/content';

import StockIdxData from '../../../_service/sina_market_data/md_fetch_agent/stock_index';
import StockIdxSubWrap from '../../../_service/sina_market_data/md_sub/stock_index';
import IndexTable from '../../component/stock_table/container/index';

import HoldTableMarketData from './component/hold_table_md';
import HoldTableContainer from './component/hold_table';
import NeedToClearenceTable from './component/need_clearence_table';

import StockSubWrap from '../../../_service/sina_market_data/md_sub/stock';
import StockTable from '../../component/stock_table/container/stock';
import StockData from '../../../_service/sina_market_data/md_fetch_agent/stock';

class HoldTablePage extends React.Component{
    render() {
        const china_index =["s_sh000001","s_sz399001","s_sz399005","s_sz399006","s_sh000300","s_sh510050"];
        const global_index= ["int_dji","int_nasdaq","int_sp500","int_nikkei","int_hangseng","int_ftse"];
        let index_list = [...china_index,...global_index];

    return (
                <Content>
                    <HoldTableMarketData interval={15000}/>
                    <HoldTableContainer/>
                    <NeedToClearenceTable stoploss_rate="5.0" max_hold_day="4" />

                    <div>指数行情</div>
                    <StockIdxSubWrap symbol_list={index_list}>
                    <table style={{width: "100%"}}>
                        <tbody >
                            <tr >
                        <td><IndexTable symbol_list={china_index}/></td>
                        <td><IndexTable symbol_list={global_index}/></td>
                       </tr>
                       </tbody>
                    </table>
                    </StockIdxSubWrap>

                    <StockIdxData key="china_index" symbol_list={china_index}  interval={15000}/>
                    <StockIdxData key="global_index" symbol_list={global_index}  interval={15000}/>
                </Content>
        );
    } 
}
  
export default withApollo(HoldTablePage);


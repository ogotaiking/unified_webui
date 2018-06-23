import React   from 'react';

import StockIdxData from '../../../../_service/sina_market_data/md_fetch_agent/stock_index';
import StockIdxSubWrap from '../../../../_service/sina_market_data/md_sub/stock_index';
import IndexTable from '../../../component/stock_table/container/index';
import { check_device_type } from '../../../component/util/responsive_view';
import { MARKET_DATA } from '../../../config';

class IndexTableContainer extends React.Component{
    render() {
        const china_index =["s_sh000001","s_sz399001","s_sz399005","s_sz399006","s_sh000300","s_sh510050"];
        const global_index= ["int_dji","int_nasdaq","int_sp500","int_nikkei","int_hangseng","int_ftse"];
        let index_list = [...china_index,...global_index];

        const device_type = check_device_type();
        let INDEX_JSX = (
            <table style={{width: "100%"}}>
                <tbody>
                    <tr>
                        <td><IndexTable symbol_list={china_index}/></td>
                        <td><IndexTable symbol_list={global_index}/></td> 
                    </tr>
                </tbody>
            </table>  
        );
        if (device_type == 1) {
             INDEX_JSX = (
                <div>
                    <IndexTable symbol_list={china_index}/>
                    <IndexTable symbol_list={global_index}/>
                </div>
             );
        }

        return (  <div>
            <StockIdxSubWrap symbol_list={index_list} pollInterval={MARKET_DATA.query_pollInterval}>
                {INDEX_JSX}
            </StockIdxSubWrap>
              <StockIdxData key="china_index" symbol_list={china_index}   interval={MARKET_DATA.agent_refreshInterval}/> 
              <StockIdxData key="global_index" symbol_list={global_index}   interval={MARKET_DATA.agent_refreshInterval}/>     
            </div>);
    }
}
export default IndexTableContainer;

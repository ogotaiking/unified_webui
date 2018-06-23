import React   from 'react';
import {withApollo} from 'react-apollo';

import Content from '../../component/layout/content';
import HoldTableMarketData from './component/hold_table_md';
import HoldTableContainer from './component/hold_table';
import NeedToClearenceTable from './component/need_clearence_table';
import StockIndexContainer from './component/index_table';
import { check_device_type } from '../../component/util/responsive_view';
import { MARKET_DATA } from '../../config';


class HoldTablePage extends React.Component{
      
    render() {
        
    return (
        <Content>
            <HoldTableMarketData  interval={MARKET_DATA.agent_refreshInterval}/>
                持仓列表
                <HoldTableContainer/>
                清仓列表
                <NeedToClearenceTable stoploss_rate="5.0" max_hold_day="4" />
                指数行情
                <StockIndexContainer/>
        </Content>
        );
    } 
}
  
export default withApollo(HoldTablePage);


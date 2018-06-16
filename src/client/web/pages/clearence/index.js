import React   from 'react';
import {withApollo} from 'react-apollo';
import Content from '../../component/layout/content';

import HoldTableMarketData from '../hold_table/component/hold_table_md';
import NeedToClearenceTable from '../hold_table/component/need_clearence_table';
import ClearneceLogTable from './clearence_log_container';  


class HoldTablePage extends React.Component{
    render() {
        return (
                <Content>
                    <HoldTableMarketData interval={15000}/>
                    <NeedToClearenceTable stoploss_rate="4.0" max_hold_day="4" />

                    卖出交易记录

                    <ClearneceLogTable/>
                </Content>
        );
    } 
}
  
export default withApollo(HoldTablePage);


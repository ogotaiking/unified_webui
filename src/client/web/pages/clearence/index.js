import React   from 'react';

import Content from '../../component/layout/content';

import HoldTableMarketData from '../hold_table/component/hold_table_md';
import NeedToClearenceTable from '../hold_table/component/need_clearence_table';
import ClearneceLogTable from './clearence_log_container';  


class ClearenceTablePage extends React.Component{
    constructor(props){
        super(props);
        this.Downloadlog = this.Downloadlog.bind(this);
    }

    Downloadlog=()=>{
        console.log('clicked....');
        this.props.history.push(`/api/tradelog/download/clearence_table`);
    }
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
  
export default ClearenceTablePage;


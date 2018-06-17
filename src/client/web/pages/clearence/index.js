import React   from 'react';
import { Collapse } from 'antd';
import Content from '../../component/layout/content';

import HoldTableMarketData from '../hold_table/component/hold_table_md';
import NeedToClearenceTable from '../hold_table/component/need_clearence_table';
import ClearneceLogTable from './clearence_log_container';  

const Panel = Collapse.Panel;

class ClearenceTablePage extends React.Component{
    render() {
        return (
                <Content>
                    <HoldTableMarketData interval={15000}/>
                    <Collapse defaultActiveKey={['1','2']} >
                        <Panel header="待清仓列表" key="1">
                            <NeedToClearenceTable stoploss_rate="5.0" max_hold_day="4" />
                        </Panel>
                        <Panel header="已卖出交易记录" key="2">
                            <ClearneceLogTable/>
                        </Panel>
                    </Collapse>
                </Content>
        );
    } 
}
  
export default ClearenceTablePage;


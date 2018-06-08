import React   from 'react';
import {withApollo} from 'react-apollo';
import Content from '../../component/layout/content';
import StockData from '../../../_service/sina_market_data/md_fetch_agent/stock';
import StockIdxData from '../../../_service/sina_market_data/md_fetch_agent/stock_index';
import StockSubWrap from '../../../_service/sina_market_data/md_sub/stock';
import StockIdxSubWrap from '../../../_service/sina_market_data/md_sub/stock_index';

import StockTable from './component/container/stock';
import IndexTable from './component/container/index';
import HoldTable from './component/container/hold';



class HoldTablePage extends React.Component{

    
    render() {
        const hqlist1 = ['sh600444','sh600888','sh600666','sh601138'];
        const hqlist2 = ['sz000001','sz000002','sz002607','sh600888','sz300003','sz002265','sz300104','sz000735','sz002725'];


        const hold_table =[
            {
                buy_date :'2018-06-06',
                id: 'sh601138',
                name: '平安银行',
                hold_vol: 400,
                total_money: 4000
            }, {
                buy_date :'2018-06-06',
                id: 'sz000002',
                name: '万科A',
                hold_vol: 900,
                total_money: 27000
            }, {
                buy_date :'2018-06-06',
                id: 'sz300104',
                name: 'Ls',
                hold_vol: 1000,
                total_money: 4.08 * 1.05 *1000
            }, {
                buy_date :'2018-06-06',
                id: 'sz300003',
                name: 'Ls',
                hold_vol: 1000,
                total_money: 39.04 * 1.03 *1000
            }, {
                buy_date :'2018-06-06',
                id: 'sz000735',
                name: 'LNS',
                hold_vol: 900,
                total_money: 15.86 * 1.03 * 900
            },
        ];



        const china_index =["s_sh000001","s_sz399001","s_sz399005","s_sz399006","s_sh000300","s_sh510050"];
        const global_index= ["int_dji","int_nasdaq","int_sp500","int_nikkei","int_hangseng","int_ftse"];


        let sum_list = [...china_index,...global_index];
        let sum_hq = [...hqlist1,...hqlist2];

        /*<HoldTable hold_data={hold_table} chartname="2018-06-06持仓"/>
                            <i className="fa fa-signal"/>
                    <StockTable symbol_list={hqlist2} chartname="2018-05-03持仓"/>
                    
                    <span className="glyphicon glyphicon-log-out"/>
                    <IndexTable symbol_list={china_index}/>
                    <IndexTable symbol_list={global_index}/>
                    
                    */
    return (
                <Content>

                    <StockSubWrap symbol_list={sum_hq}>
                        <HoldTable hold_data={hold_table} chartname="2018-06-06持仓"/>
                        <StockTable symbol_list={hqlist2} chartname="2018-05-03持仓"/>
                    </StockSubWrap>


                    <StockIdxSubWrap symbol_list={sum_list}>
                        <IndexTable symbol_list={china_index}/>
                        <IndexTable symbol_list={global_index}/>
                    </StockIdxSubWrap>

                    <StockData key="stock1" symbol_list = {hqlist1} interval={15000}/>
                    <StockData key="stock2" symbol_list = {hqlist2} interval={15000}/>

                    <StockIdxData key="china_index" symbol_list={china_index}  interval={15000}/>
                    <StockIdxData key="global_index" symbol_list={global_index}  interval={15000}/>
                </Content>
        );
    } 
}
  
export default withApollo(HoldTablePage);


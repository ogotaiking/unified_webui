import React   from 'react';
import Content from '../../component/layout/content';
import StockMarketDataFetchAgent from '../../../_service/sina_market_data/stock';
import IndexMDFetchAgent from '../../../_service/sina_market_data/stock_index';
import StockTable from './component/container/stock';
import IndexTable from './component/container/index';


class HoldTable extends React.Component{
    
    render() {
        const hqlist1 = ['sh600444','sh600888','sh600666'];
        const hqlist2 = ['sz000001','sz000002','sz002607','sh600888','sz300003','sz002265','sz300104','sz000735','sz002725'];
        const china_index =["s_sh000001","s_sz399001","s_sz399005","s_sz399006","s_sh000300","s_sh510050"];
        const global_index= ["int_dji","int_nasdaq","int_sp500","int_nikkei","int_hangseng","int_ftse"];

    return (
                <Content>
                    <i className="fa fa-signal"/>
                    <StockTable symbol_list={hqlist2} chartname="2018-05-03持仓"/>
                    
                    <span className="glyphicon glyphicon-log-out"/>
                    <IndexTable symbol_list={china_index}/>
                    <IndexTable symbol_list={global_index}/>

                    <StockMarketDataFetchAgent key="stock1" stocklist = {hqlist1} interval={15000}/>
                    <StockMarketDataFetchAgent key="stock2" stocklist = {hqlist2} interval={15000}/>
                    <IndexMDFetchAgent key="china_index" indexlist={china_index}  interval={15000}/>
                    <IndexMDFetchAgent key="global_index" indexlist={global_index}  interval={15000}/>
                </Content>
        );
    } 
}
  
export default HoldTable;


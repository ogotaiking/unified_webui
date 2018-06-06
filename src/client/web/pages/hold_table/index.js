import React   from 'react';
import Content from '../../component/layout/content';
import StockMarketDataFetchAgent from '../../../_service/sina_market_data/stock';

class LoginHistory extends React.Component{
    
    render() {
        const hqlist1 = ['sh600444','sh600888','sh600666'];
        const hqlist2 = ['sz000001','sz000002','sz300003'];
    return (
                <Content>
                    <StockMarketDataFetchAgent key="stock1" stocklist = {hqlist1} interval={15000}/>
                    <StockMarketDataFetchAgent key="stock2" stocklist = {hqlist2} interval={15000}/>
                </Content>
        );
    } 
}
  
export default LoginHistory;


import React   from 'react';
import Content from '../../component/layout/content';
import StockHQ from '../../../_service/sina_hq/stock';

class LoginHistory extends React.Component{
    
    render() {
        const hqlist1 = ['sh600444','sh600888','sh600666'];
        const hqlist2 = ['sz000001','sz000002','sz300003'];
    return (
                <Content>
                    <StockHQ key="stock1" stocklist = {hqlist1} interval={15000}/>
                    <StockHQ key="stock2" stocklist = {hqlist2} interval={15000}/>
                </Content>
        );
    } 
}
  
export default LoginHistory;


import React            from 'react';
import { withApollo } from 'react-apollo';
import { FetchStockDataFromStore, FetchStockIndexDataFromStore} from '../../../_service/sina_market_data/fetch_data_from_store';

import LayoutContent from '../../component/layout/content';




class Home extends React.Component{
    componentDidMount(){
        console.log(FetchStockDataFromStore(this.props.client,['sh600444','sz000001']));
        console.log(FetchStockIndexDataFromStore(this.props.client,['sh000001','sh000300']));
        
    }

    render() {    
        return (
               <LayoutContent>Hello World. This is home page.
               </LayoutContent>
        );
    } 
}
export default withApollo(Home);


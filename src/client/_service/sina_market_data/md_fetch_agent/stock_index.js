import React from 'react';
import {graphql ,withApollo} from 'react-apollo';
import gql from 'graphql-tag';
import { STOCK_INDEX_DATA_MUTATION } from '../graphql/stock_index';
import { StockMarketData_IndexFetch } from '../api';

class IndexMarketDataFetchAgent extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
    }
    componentDidMount() {
        setTimeout( () => {
            this.fetchData();
            this.interval = setInterval(this.fetchData, parseInt(this.props.interval));     
          }, Math.floor(Math.random() * 5000 + 3000));       
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    fetchData() {
       // console.log('Fetching...',this.props.interval)
       StockMarketData_IndexFetch(this.props.symbol_list).then( 
            data => {
                //console.log("-FetchResult:",data);
                this.props.update_stock({
                    variables: {
                        data
                    }
                });
                //clear mutation cache to avoid memoryleak
                //console.log(window.__APOLLO_CLIENT__.store.cache.data.data['ROOT_MUTATION']);
                this.props.client.store.cache.data.delete('ROOT_MUTATION');
                //console.log(window.__APOLLO_CLIENT__.store.cache.data.data['ROOT_MUTATION']);
            });   
    }
    render(){        
        return (
            <div />
        );
    } 
}

export default graphql(STOCK_INDEX_DATA_MUTATION,{name: 'update_stock'})(withApollo(IndexMarketDataFetchAgent));

import React from 'react';
import {graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { StockMarketData_IndexFetch } from './api';

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
       StockMarketData_IndexFetch(this.props.indexlist).then( 
            data => {
                //console.log("-FetchResult:",data);
                this.props.update_stock({
                    variables: {
                        data
                    }
                });
            });   
    }
    render(){        
        return (
            <div />
        );
    } 
}
const POST_MUTATION = gql`
    mutation PostMutation($data: [StockIndex_INPUT!]!){
        UPDATE_STOCK_INDEX_DATA(stock: $data) 
        {
            stockname
            current
            pricechange
            pctchange
        }
    }
`;

export default graphql(POST_MUTATION,{name: 'update_stock'})(IndexMarketDataFetchAgent);

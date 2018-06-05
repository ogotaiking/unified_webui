import React from 'react';
import {graphql } from 'react-apollo';
import gql from 'graphql-tag';

import {StockHQFetch,StockHQStrParser} from './api';

class StockHQ extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
    }
    componentDidMount() {
        this.fetchData();
        this.interval = setInterval(this.fetchData, parseInt(this.props.interval));     
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    fetchData() {
       // console.log('Fetching...',this.props.interval)
        StockHQFetch(this.props.stocklist).then( 
            data => {
                console.log("FetchResult:",data);
                this.props.update_stock({
                    variables: {
                        data
                    }
                });
                //TODO : Add code here to send the fetch result to Server again by GraphQL-sub
                /* this.setState({
                     data: data
                });*/
            });   
    }
    render(){        
        return (
            <div />
        );
    } 
}
const POST_MUTATION = gql`
    mutation PostMutation($data: [StockType_INPUT!]!){
        UPDATE_STOCK_DATA(stock: $data) 
        {
            stockname
            currentdate
            currenttime
        }
    }
`;

export default graphql(POST_MUTATION,{name: 'update_stock'})(StockHQ);

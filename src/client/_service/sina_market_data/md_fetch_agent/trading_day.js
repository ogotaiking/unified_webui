import React from 'react';
import {graphql ,withApollo} from 'react-apollo';
import gql from 'graphql-tag';
import { TradingDayDataFetch } from '../api';

const UPDATE_TRADING_DAY = gql`mutation UPDATE_TRADING_DAY($data: [String!]!){
    UPDATE_TRADING_DAY(tradingday: $data) 
}`;



class FetchTradingDay extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        TradingDayDataFetch().then(
            data => {
                this.props.update_trading_day({
                    variables: {
                        data
                    }
                });
            });
        this.props.client.store.cache.data.delete('ROOT_MUTATION');     
    }
    render(){        
        return (
            <div />
        );
    } 
}

export default graphql(UPDATE_TRADING_DAY,{name: 'update_trading_day'})(withApollo(FetchTradingDay));

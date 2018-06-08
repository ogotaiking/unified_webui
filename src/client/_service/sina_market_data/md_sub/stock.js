import React from 'react';
import { graphql } from 'react-apollo';
import  gql  from 'graphql-tag';
import { STOCK_DATA_QUERY, STOCK_DATA_SUBSCRIPTION } from '../graphql/stock';

class StockMDSubWrapper extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            market_data : new Map()
        };
    }
    static getDerivedStateFromProps(nextProp,prevState) {
        //console.log('DerivedStateFunction:',prevState.market_data.size,nextProp.stockQuery.STOCK_INDEX_DATA);
        if ( (prevState.market_data.size == 0 ) && (nextProp.stockQuery.STOCK_DATA) ) {
            let result = new Map();
            nextProp.stockQuery.STOCK_DATA.map((item)=> {
                result.set(item.id,item);
            });
            return { market_data: result};
        } else {
            return null;
        }
    }    

    componentDidMount(){
        this._subscribeData(this.props.symbol_list);
    }

    _filter_by_symbol(item,symbol){
        return item.id !=symbol;
    }

    _subscribeData = (symbol_list) => {
        this.props.stockQuery.subscribeToMore({
            document:STOCK_DATA_SUBSCRIPTION,
            variables: { 
                symbol_list 
            },
            updateQuery: (previous, { subscriptionData}) => {
                if (!subscriptionData) return previous;
                let new_data = subscriptionData.data.STOCK_DATA;
                //这是在收盘时间测试刷新的一个hack
                //new_data.currenttime= new Date().toLocaleTimeString();    
                
                //update local state
                let result_map = this.state.market_data;
                result_map.set(new_data.id,new_data);
                this.setState({market_data: result_map});

                //update return
                let prev_w_filter = previous.STOCK_DATA.filter((prev_item)=>{ return this._filter_by_symbol(prev_item,new_data.id); } );
                let new_Return = Object.assign({},previous,{
                    STOCK_DATA: [...prev_w_filter, new_data]
                });
                //console.log("UPDATE-QUERY",previous,new_Return);
                return new_Return;
            },
        });
  }

  render() {
    if (this.props.children instanceof Array ) {
        let result = this.props.children.map((item,iter)=>{
            return React.cloneElement(item, {key: iter, market_data: this.state.market_data});
        });
        return (<div>{result}</div>);
    } else {
        return (
            <div>
            {React.cloneElement(this.props.children, {market_data: this.state.market_data})}
            </div>
        );
    }
 }
}

export default graphql(STOCK_DATA_QUERY, {
  name: 'stockQuery',
  options: ownProps => {
    const symbol_list = ownProps.symbol_list;
    return {
      variables: {
        symbol_list
     },
    };
   },
  //cachePolicy: { query: true, data: false } 
})(StockMDSubWrapper);
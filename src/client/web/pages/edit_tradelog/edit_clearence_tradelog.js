import React   from 'react';
import { Query } from 'react-apollo';
import {Button} from 'antd';
import { STOCK_CLEARENCE_TABLE_QUERY } from '../../../_service/stock/graphql/clearence';
import LoadingBox from '../../component/util/loadingbox';
import ErrorBox from '../../component/util/errorbox';
import Content from '../../component/layout/content';
import EditClearenceTradeLogTable from './component/mutation_clearence';



class EditClearenceLog extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            pollInterval : 0
        };
    }


    refreshPage() {
        //console.log('refresh called...');
        this.setState({pollInterval: 300});
        setTimeout(() => {
            //console.log('recover...');
            this.setState({pollInterval:0});
        }, 500);
    }

    returnRenderJSX(data) {
        const columns = [{
            title: '股票代码',
            dataIndex: 'symbol',
          }, {
            title: '股票名称',
            dataIndex: 'name',
          }, {
            title: '交易数量',
            dataIndex: 'volume',
          }, {
            title: '交易均价',
            dataIndex: 'trade_price',
          }, {
            title: '交易金额',
            dataIndex: 'total_money',
          }, {      
            title: '交易日期',
            dataIndex: 'trade_date',
          }];

        let hash_map = new Map();
        if (data.CLEARENCE_TABLE instanceof Array) {
            //sort by date
            let temp_data = [...data.CLEARENCE_TABLE];
            temp_data.sort(function(a,b){ 
                const aT = new Date(a.trade_date); 
                const bT = new Date(b.trade_date);
                return aT-bT;
            });

            temp_data.map((item)=>{
                let key = item.trade_date;
                let bucket = hash_map.get(key);
                let result_list = [];
                if (bucket) {
                    result_list = bucket;
                } 
                result_list.push(item);
                hash_map.set(key,result_list);
            });
        }

        let result_jsx = [];
        hash_map.forEach((value,key)=>{
            let chartname = key + "清仓";
            result_jsx.push(<EditClearenceTradeLogTable key={key} rowKey={value => value.id}  dataSource={value} chartname={chartname} columns={columns} refreshpage={this.refreshPage.bind(this)}/>);
        });
        //console.log(hash_map,result_jsx);
            return (  
            <div>
                {result_jsx.map((item)=>{return item;})}
            </div>
        );
    }
    render() {     
        return (
                <Content>
                    修改卖出日志数据库
                    
                    <Query query={STOCK_CLEARENCE_TABLE_QUERY}  fetchPolicy="network-only" pollInterval={this.state.pollInterval} >
                    {({loading,error,data})=>{
                        if (loading) return  <LoadingBox/>;
                        if (error) return <ErrorBox title={error.toString()} 
                                        message={error.message} />;
                            return ( this.returnRenderJSX(data) );
                    }}
                    </Query>
                </Content>
        );
    } 
}

export default EditClearenceLog;
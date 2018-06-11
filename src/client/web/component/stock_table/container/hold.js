import React from 'react';
import Table from '../table/hold_table';

class HoldTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hold_table: new Map(),
      clearence_table: new Map(),
      isupdate : true
    };
  }

  static getDerivedStateFromProps(nextProp, prevState) {
    //第一次初始化hold_table
    if (prevState.hold_table.size == 0) {
      let shouldChange = true;
      let result = new Map();
      let result_clearence = new Map();
      let DateNow = new Date();
      nextProp.hold_data.map((hold_item) => {
        if (!nextProp.market_data.get(hold_item.symbol)) {
          //当未完全获取行情时，不计算不更新
          shouldChange = false;
        } else {
          let new_item = { ...nextProp.market_data.get(hold_item.symbol)};
          new_item.trade_date = hold_item.trade_date;
          new_item.volume = hold_item.volume;
          new_item.total_money = hold_item.total_money;
          new_item.hold_price = (hold_item.total_money / hold_item.volume).toFixed(3);
          new_item.cum_pctchange = ((new_item.current - new_item.hold_price) * 100.0 / new_item.hold_price).toFixed(2);
          new_item.earn = (new_item.current * new_item.volume - new_item.total_money).toFixed(2);
          result.set(new_item.id, new_item);
          //检测并更新清算表:
          if (nextProp.clearence_mode) {
            let newDate = new Date(hold_item.trade_date);
            let T_Delta = ( DateNow - newDate)/1000/3600/24;
            //T+1且大于止损线，或者大于最大持仓天数
            if (((T_Delta > 1) && (new_item.cum_pctchange > parseFloat(nextProp.stoploss_rate))) || (T_Delta > parseFloat(nextProp.max_hold_day))) {
              let existing_result = result_clearence.get(new_item.id);
              if (!existing_result) {
                new_item.trade_detail = new_item.trade_date.slice(5) + "("+ new_item.volume.toString()+" 股)";
                result_clearence.set(new_item.id,new_item);
              } else {
                existing_result.trade_detail = existing_result.trade_detail  + ' , ' + new_item.trade_date.slice(5) + "("+ new_item.volume.toString() +" 股)";
                existing_result.total_money = existing_result.total_money + new_item.total_money;
                existing_result.volume = existing_result.volume + new_item.volume;
                //calculate new result...
                existing_result.hold_price =  (existing_result.total_money / existing_result.volume).toFixed(3);
                existing_result.cum_pctchange = ((new_item.current - existing_result.hold_price) * 100.0 / existing_result.hold_price).toFixed(2);
                existing_result.earn = (new_item.current * existing_result.volume - existing_result.total_money).toFixed(2);
                result_clearence.set(new_item.id,existing_result);
              }
            }
          }
        }
      });
      //如果市场行情不全将不更新holdtable，直到完全获得行情，这样才能计算准确的盈亏
      if (shouldChange) {
        return {  
                  hold_table: result , 
                  clearence_table: result_clearence,
                  isupdate: true 
               };
      } else {
        return { isupdate : false };
      }
    } else {
      //hold_table已经完成更新，则只检查新传入的market_data时间
      let notChangeFlag = true;
      let result_clearence = new Map();
      let DateNow = new Date();
      let result = prevState.hold_table;
      nextProp.hold_data.map((hold_item) => {
        const id = hold_item.symbol;
        //如果market_data中所持仓股票的数据，并且新的数据时间和已有table时间不一致，则更新
        if (
          (nextProp.market_data.get(id)) && 
          (nextProp.market_data.get(id).currenttime != result.get(id).currenttime)
        ) {
          notChangeFlag = false;
          let new_item = { ...nextProp.market_data.get(hold_item.symbol)  };
          new_item.trade_date = hold_item.trade_date;
          new_item.volume = hold_item.volume;
          new_item.total_money = hold_item.total_money;
          new_item.hold_price = (hold_item.total_money / hold_item.volume).toFixed(3);
          new_item.cum_pctchange = ((new_item.current - new_item.hold_price) * 100.0 / new_item.hold_price).toFixed(2);
          new_item.earn = (new_item.current * new_item.volume - new_item.total_money).toFixed(2);
          result.set(new_item.id, new_item);
          //检测并更新清算表:
          if (nextProp.clearence_mode) {
              let newDate = new Date(hold_item.trade_date);
              let T_Delta = ( DateNow - newDate)/1000/3600/24;
              console.log(new_item,T_Delta,nextProp.clearence_mode,nextProp.max_hold_day,nextProp.stoploss_rate);
              //T+1且大于止损线，或者大于最大持仓天数
              if (((T_Delta > 1) && (new_item.cum_pctchange > parseFloat(nextProp.stoploss_rate))) || (T_Delta > parseFloat(nextProp.max_hold_day))) {
                  let existing_result = result_clearence.get(new_item.id);
                  if (!existing_result) {
                      new_item.trade_detail = new_item.trade_date.slice(5) + "("+ new_item.volume.toString()+" 股)";
                      result_clearence.set(new_item.id,new_item);
                  } else {
                    existing_result.trade_detail = existing_result.trade_detail  + ' , ' + new_item.trade_date.slice(5) + "("+ new_item.volume.toString() +" 股)";
                      existing_result.total_money = existing_result.total_money + new_item.total_money;
                      existing_result.volume = existing_result.volume + new_item.volume;
                      //calculate new result...
                      existing_result.hold_price =  (existing_result.total_money / existing_result.volume).toFixed(3);
                      existing_result.cum_pctchange = ((new_item.current - existing_result.hold_price) * 100.0 / existing_result.hold_price).toFixed(2);
                      existing_result.earn = (new_item.current * existing_result.volume - existing_result.total_money).toFixed(2);
                      result_clearence.set(new_item.id,existing_result);
                  }
              }
          }          
        }
      });
      if (notChangeFlag) {
        return { isupdate : false };
      } else {
        return {  
          hold_table: result , 
          clearence_table: result_clearence,
          isupdate: true 
       };
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
      return nextState.isupdate;
  }

  _DataToRender = () => {
    //console.log('re-rending....');
    if (this.props.clearence_mode) {
      return [...this.state.clearence_table.values()];  
    } else {
      return [...this.state.hold_table.values()];
    }
  }

  render() {
    console.log(window.innerWidth,window.innerHeight);
    const DataToRender = this._DataToRender();
    let sum_money = 0.0;
    let sum_ratio = 0.0;
    let sum_earn = 0.0;
    let render_mode = 'colored';
    if (DataToRender.length > 0) {
      DataToRender.map((item) => {
        sum_money = sum_money + parseFloat(item.total_money);
        sum_earn = sum_earn + parseFloat(item.earn);
      });
      sum_ratio = (sum_earn / sum_money * 100).toFixed(3);
    }
    let columns = [{
      title: '股票代码',
      dataIndex: 'id',
    }, {
      title: '股票名称',
      dataIndex: 'stockname',
    }, {
      title: '持仓数量',
      dataIndex: 'volume',
    }, {
      title: '累计盈亏%',
      dataIndex: 'cum_pctchange',
    }, {
      title: '成本价',
      dataIndex: 'hold_price',
    }, {
      title: '现价',
      dataIndex: 'current',
    }, {
      title: '涨跌',
      dataIndex: 'pricechange',
    }, {
      title: '今日涨跌幅',
      dataIndex: 'pctchange',
    }, {
      title: '最高',
      dataIndex: 'high',
    }, {
      title: '最低',
      dataIndex: 'low',
    }, {
      title: '累计盈亏',
      dataIndex: 'earn',
    }, {
      title: 'Time',
      dataIndex: 'currenttime',
    }];
    if (this.props.clearence_mode) {
      render_mode = "simple";
      columns = [{
        title: '股票代码',
        dataIndex: 'id',
      }, {
        title: '股票名称',
        dataIndex: 'stockname',
      }, {
        title: '需卖出数量',
        dataIndex: 'volume',
      }, {
        title: '现价',
        dataIndex: 'current',
      }, {
        title: '今日涨跌幅',
        dataIndex: 'pctchange',
      }, {
        title: '买入价',
        dataIndex: 'buy',
      }, {
        title: '卖出价',
        dataIndex: 'sell',
      }, {
        title: '累计盈亏',
        dataIndex: 'earn',
      }, {
        title: '交易详细记录',
        dataIndex:'trade_detail',
      }];
    }

    return ( <Table chartname = {this.props.chartname}
      rowKey = {DataToRender => DataToRender.id}
      dataSource = {DataToRender}
      columns = {columns}
      sum_money = {sum_money}
      sum_ratio = {sum_ratio}
      sum_earn = {sum_earn}
      render_mode = {render_mode}
      />
    );
  }
}

export default HoldTable;
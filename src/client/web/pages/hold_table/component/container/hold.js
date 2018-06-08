import React from 'react';
import {
  graphql
} from 'react-apollo';
import {
  Spin,
  Alert
} from 'antd';
import gql from 'graphql-tag';
import LoadingBox from '../../../../component/util/loadingbox';
import ErrorBox from '../../../../component/util/errorbox';
import Table from '../table/hold_table';

import {
  STOCK_DATA_QUERY,
  STOCK_DATA_SUBSCRIPTION
} from '../../../../../_service/sina_market_data/graphql/stock';


class HoldTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hold_table: new Map(),
      isupdate : true
    };
  }

  static getDerivedStateFromProps(nextProp, prevState) {
    //第一次初始化hold_table
    if (prevState.hold_table.size == 0) {
      let shouldChange = true;
      let result = new Map();
      nextProp.hold_data.map((hold_item) => {
        if (!nextProp.market_data.get(hold_item.id)) {
          shouldChange = false;
        } else {
          let new_item = { ...nextProp.market_data.get(hold_item.id)      };
          new_item.buy_date = hold_item.buy_date;
          new_item.hold_vol = hold_item.hold_vol;
          new_item.total_money = hold_item.total_money;
          new_item.hold_price = (hold_item.total_money / hold_item.hold_vol).toFixed(3);
          new_item.cum_pctchange = ((new_item.current - new_item.hold_price) * 100.0 / new_item.hold_price).toFixed(2);
          new_item.earn = (new_item.current * new_item.hold_vol - new_item.total_money).toFixed(2);
          result.set(new_item.id, new_item);
        }
      });
      //如果市场行情不全将不更新holdtable，直到完全获得行情，这样才能计算准确的盈亏
      if (shouldChange) {
        return {  hold_table: result ,isupdate: true };
      } else {
        return { isupdate : false };
      }
    } else {
      //hold_table已经完成更新，则只检查新传入的market_data时间
      let notChangeFlag = true;
      let result = prevState.hold_table;
      nextProp.hold_data.map((hold_item) => {
        const id = hold_item.id;
        //如果market_data中所持仓股票的数据，并且新的数据时间和已有table时间不一致，则更新
        if (
          (nextProp.market_data.get(id)) && 
          (nextProp.market_data.get(id).currenttime != result.get(id).currenttime)
        ) {
          notChangeFlag = false;
          let new_item = { ...nextProp.market_data.get(hold_item.id)  };
          new_item.buy_date = hold_item.buy_date;
          new_item.hold_vol = hold_item.hold_vol;
          new_item.total_money = hold_item.total_money;
          new_item.hold_price = (hold_item.total_money / hold_item.hold_vol).toFixed(3);
          new_item.cum_pctchange = ((new_item.current - new_item.hold_price) * 100.0 / new_item.hold_price).toFixed(2);
          new_item.earn = (new_item.current * new_item.hold_vol - new_item.total_money).toFixed(2);
          result.set(new_item.id, new_item);
        }
      });
      if (notChangeFlag) {
        return { isupdate : false };
      } else {
        return {  hold_table: result ,isupdate: true };
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
      return nextState.isupdate;
  }

  _DataToRender = () => {
    //console.log('re-rending....');
    return [...this.state.hold_table.values()];
  }

  render() {
    const DataToRender = this._DataToRender();
    let sum_money = 0.0;
    let sum_ratio = 0.0;
    let sum_earn = 0.0;
    if (DataToRender.length > 0) {
      DataToRender.map((item) => {
        sum_money = sum_money + parseFloat(item.total_money);
        sum_earn = sum_earn + parseFloat(item.earn);
      });
      sum_ratio = (sum_earn / sum_money * 100).toFixed(3);
    }
    const columns = [{
      title: '股票代码',
      dataIndex: 'id',
    }, {
      title: '股票名称',
      dataIndex: 'stockname',
    }, {
      title: '持仓数量',
      dataIndex: 'hold_vol',
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

    return ( <Table chartname = {this.props.chartname}
      rowKey = {DataToRender => DataToRender.id}
      dataSource = {DataToRender}
      columns = {columns}
      sum_money = {sum_money}
      sum_ratio = {sum_ratio}
      sum_earn = {sum_earn}
      />
    );
  }
}

export default HoldTable;
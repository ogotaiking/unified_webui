import React from 'react';
import { graphql } from 'react-apollo';
import { Spin, Table,Alert }  from 'antd';
import  gql  from 'graphql-tag';
import LoadingBox from '../../../component/util/loadingbox';
import ErrorBox from '../../../component/util/errorbox';


class LoginHistory extends React.Component {
  _historyLogToRender = () => {
    return this.props.feedQuery.loginhistory_query;
  }

  render() {
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <LoadingBox/>;
    }

    if (this.props.feedQuery && this.props.feedQuery.error) {
      return  <ErrorBox title={this.props.feedQuery.error.toString()} 
                     message={'['+this.props.chartname +']:获取数据错误'} 
              />;
    }

    const historyLogToRender = this._historyLogToRender();
    const columns = [{
        title: '用户名',
        dataIndex: 'username',
        width: '10%',
      }, {
        title: '登陆日期',
        dataIndex: 'createTime',
        width: '15%',
      }, {
        title: 'IP',
        dataIndex: 'ip',
        width: '20%',
      }, {
        title: '登陆地点',
        dataIndex: 'login_city',
        width: '15%'
      }, {
        title: '运营商',
        dataIndex: 'spname',
        width: '10%'
      }, {
        title: 'User-Agent',
        dataIndex: 'user_agent',
      }];

    return (
       <Table rowKey={historyLogToRender => historyLogToRender._id} 
              dataSource={historyLogToRender} 
              columns={columns} size="small" />
    );
 }
}
export const FEED_QUERY = gql`
query{
    loginhistory_query{
      _id
      ip
      uid
      username
      user_agent     
      createTime
      login_city
      spname
    }
  }
`;


export default graphql(FEED_QUERY, {
  name: 'feedQuery',
  cachePolicy: { query: true, data: false } 
})(LoginHistory);
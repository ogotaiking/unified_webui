import React from 'react';
import { graphql } from 'react-apollo';
import { notification,Spin, Table,Alert }  from 'antd';
import  gql  from 'graphql-tag';


class LoginHistory extends React.Component {
  _historyLogToRender = () => {
    return this.props.feedQuery.loginhistory_query;
  }

  render() {
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      const Title = '获取数据中....';
      return (<Spin tip="Loading..." >
                <Alert message={Title} 
                     description="Fetching Data..."
                     type="info"
                />
              </Spin>);
    }

    if (this.props.feedQuery && this.props.feedQuery.error) {
      const ErrorMsg = this.props.feedQuery.error.toString();
      const Title = '['+this.props.chartname +']:获取数据错误';
      return  <Alert message={Title} 
                     description={ErrorMsg} 
                     type="error"
                     showIcon
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
              columns={columns} />
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
//  cachePolicy: { query: true, data: false } 
})(LoginHistory);
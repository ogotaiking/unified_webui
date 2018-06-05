import React   from 'react';
import Content from '../../component/layout/content';
import HistoryTable from './component/login_history_table';

class LoginHistory extends React.Component{
    
    render() {
        const pathlist = [ 
            {name: '用户管理', link : '/'},
            {name: '登陆日志', link : '/user/loginhistory'},

        ];
    return (
                <Content pathlist={pathlist}>
                    <HistoryTable chartname="登陆历史记录" />
                </Content>
        );
    } 
}
  
export default LoginHistory;


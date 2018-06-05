import React            from 'react';
import {  Switch, Redirect, Route, Link } from 'react-router-dom';
import LoginHistory from './loginhistory';

class User extends React.Component{
  render() {
      const pathlist= [{name: '用户管理', link : '/user'}];
      return <Switch>
                 <Route exact path="/user/loginhistory" component={LoginHistory}/>
             </Switch>;
  }
}

export default User;
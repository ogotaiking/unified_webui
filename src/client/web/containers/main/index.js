import React            from 'react';
import {  Switch, Redirect, Route, Link,withRouter } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {  actions as authActions,  getLoggedUser } from '../../../_service/reduxstore/modules/auth';
import ClientLayout from '../../component/layout';
import asyncComponent   from '../../../_util/asyncComponent';
import connectRoute  from '../../../_util/connectRoute';
import '../login/index.scss';

const Home = connectRoute(asyncComponent(() => import("../../pages/home")));
const User = connectRoute(asyncComponent(() => import("../../pages/user")));
const HoldTable = connectRoute(asyncComponent(() => import("../../pages/hold_table")));


class Main extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      redirectToLogin: false
    };
  }
  
  componentDidMount(){
    if (this.props.user.get("uid")=== null) {
      //此处延迟300ms先让系统渲染出全屏LoginDIV，防止首页白屏时间过长的问题
      setTimeout(()=> {
        this._loadAsyncData(this.props.user.get("uid"));
      }, 300);     
    }
  }

  _loadAsyncData(uid) {
      if ( uid === null ) {
          this.props.reinitstore().then( (value) => { 
          if (value == "error") {      
            this.setState({redirectToLogin : true});
          }else {            
            return null;
      }});
    }
  }

  render(){
    const { redirectToLogin } = this.state;
    if ( redirectToLogin ) {
      return <Redirect to = {
        {
          pathname: "/login",
          state: {from:this.props.location}
         }
        } /> ;
    } 

    const userpriv = this.props.user.get("privilegeLevel");
    const username = this.props.user.get("username");

    if (userpriv == -1 ) {
      return <div className="loginDIV"/>;
    } 
    return (
      
        <ClientLayout username={username} userpriv={userpriv} >
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Redirect exact from="/order" to="/order/index"/>
                    <Route path="/user" component={User}/>
                    <Route path="/hold_table" component={HoldTable}/>
                    <Redirect from="*" to="/"/>
                </Switch>
         </ClientLayout>
        );
    } 
}



const mapStateToProps = (state, props) => {
    return { 
      user: getLoggedUser(state)
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      ...bindActionCreators(authActions, dispatch)
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main));


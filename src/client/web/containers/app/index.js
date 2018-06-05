import React            from 'react';
import ReactDOM         from 'react-dom';
import { Modal,Spin }      from 'antd';
import { BrowserRouter , Switch, Redirect, Route, Link } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import asyncComponent   from '../../../_util/asyncComponent';
import connectRoute  from '../../../_util/connectRoute';


import './index.scss';
import {
    actions as appActions,
    getError,
    getpendingRequest
  } from '../../../_service/reduxstore/modules/app';


const Login = connectRoute(asyncComponent(() => import("../login")));
const Logout = connectRoute(asyncComponent(() => import("../logout")));
const SignUP = connectRoute(asyncComponent(() => import("../signup")));
const Main = connectRoute(asyncComponent(() => import("../main")));

class App extends React.Component{
    componentDidUpdate() {            
        const {error} = this.props;
        let removeError = this.props.removeError;
        if (error) {
            Modal.error({
                title: 'This is an error message',
                content: error,
                onOk() { removeError();}
              });
            console.log(error);
        }
    }

    render(){
        const {error , pendingRequest } = this.props;
        let  isLoading = (pendingRequest>0);

        return (
            <div>
            <Spin className="LoadingAnimation" spinning={isLoading} size="large" >
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/signup" component={SignUP}/>
                    <Route path="/" component={Main}/>
                </Switch> 
            </BrowserRouter>
            </Spin>
            </div>

        );
    } 
}

const mapStateToProps = (state, props) => {
    return {
      error: getError(state),
      pendingRequest: getpendingRequest(state)
    };
  };
  
const mapDispatchToProps = dispatch => {
    return {
      ...bindActionCreators(appActions, dispatch)
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(App);
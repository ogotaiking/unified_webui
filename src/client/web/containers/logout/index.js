import React from 'react';
import {  bindActionCreators } from "redux";
import {  connect } from "react-redux";
import {  Redirect } from "react-router-dom";
import {  Form,  Icon,  Input,  Button,  message} from 'antd';
import { withApollo } from 'react-apollo';
import LocalStorage from '../../../_util/localstorage';

import {  actions as authActions,  getLoggedUser } from "../../../_service/reduxstore/modules/auth";
import FetchFingerPrint from '../../../_util/fingerprint';
import TransitionAnimation from '../../component/util/transition';

//Share login style
import '../login/index.scss';

const _localstorage = new LocalStorage();

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToLogin: false
    };
  }

  componentDidMount() {
    if (this.state.redirectToLogin == false) {
      this.props.client.resetStore().then( 
          FetchFingerPrint.get((fp, info) => {
           // console.log('Finish clear cache in logout',this.props.user.get("token"),fp);
            this.props.requestlogout(this.props.user.get("token"), fp);
            //_localstorage.removeStorage('reduxPersist:auth');
            //_localstorage.removeStorage('reduxPersist:app');
            //_localstorage.removeStorage('AUTH_TOKEN');
            setTimeout(()=> {
              this.setState({
                redirectToLogin: true
              });
            }, 1000);     
          })
      );
    }
  }

  render() {
    const { redirectToLogin } = this.state;
    if (redirectToLogin) {
      return <Redirect to = "/login" /> ;
    }
    return (         
      <TransitionAnimation>
        <div className="loginDIV" />
      </TransitionAnimation>
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

export default connect(mapStateToProps, mapDispatchToProps)(withApollo(Logout));


/** Clear all cookies on logout
let cookies = document.cookie.split(";");
for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
axios.post('/auth/logout').then( (response)=>{
    console.log(response.data);
    if (response.data.status === 'success') {
        _localstorage.removeStorage('reduxPersist:auth');
        this.props.history.push("/login");
    } else {
       message.error(response.data.errmsg);
    }
 }) 
 .catch((error)=> {
     message.error('服务器似乎开小差去了～');
     this.props.history.push("/");
     console.log(error);
 });
 */
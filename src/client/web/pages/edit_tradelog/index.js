import React            from 'react';
import {  Switch, Route,Redirect,withRouter } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {  actions as authActions,  getLoggedUser } from '../../../_service/reduxstore/modules/auth';


import Upload_FradeLog from './upload_tradelog';
import Edit_Clearence_FradeLog from './edit_clearence_tradelog';
import Edit_Hold_FradeLog from './edit_hold_tradelog';

class EditTradeLog extends React.Component{
  
  render() {
    const userpriv = this.props.user.get("privilegeLevel");
    if (userpriv < 10 ) {
      return <Redirect to ="/" />;
    } 

    return <Switch>
                 <Route exact path="/edit_tradelog/upload_tradelog" component={Upload_FradeLog}/>
                 <Route exact path="/edit_tradelog/edit_hold_tradelog" component={Edit_Hold_FradeLog}/>
                 <Route exact path="/edit_tradelog/edit_clearence_tradelog" component={Edit_Clearence_FradeLog}/>
                 
             </Switch>;
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditTradeLog));
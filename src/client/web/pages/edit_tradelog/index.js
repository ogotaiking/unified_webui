import React            from 'react';
import {  Switch, Route, } from 'react-router-dom';
import Upload_FradeLog from './upload_tradelog';
import Edit_Clearence_FradeLog from './edit_clearence_tradelog';

class EditTradeLog extends React.Component{
  render() {
      return <Switch>
                 <Route exact path="/edit_tradelog/upload_tradelog" component={Upload_FradeLog}/>
                 <Route exact path="/edit_tradelog/edit_hold_tradelog" component={Upload_FradeLog}/>
                 <Route exact path="/edit_tradelog/edit_clearence_tradelog" component={Edit_Clearence_FradeLog}/>
                 
             </Switch>;
  }
}

export default EditTradeLog;
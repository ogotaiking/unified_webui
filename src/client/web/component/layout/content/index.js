import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import LayoutBreadcrumb from '../breadcrumb';
import './index.scss';


class Content extends React.Component {
  
  render() {   
    return (
      <ReactCSSTransitionGroup
      transitionAppear
      transitionAppearTimeout={500}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={200}
      transitionName="loadContent"
    >
        <LayoutBreadcrumb pathlist = {this.props.pathlist}/>
        <div style = {{padding: 24,background: '#fff',minHeight: 360}} > 
            {this.props.children} 
        </div> 
      </ReactCSSTransitionGroup>
    );
  }
}

export default Content;

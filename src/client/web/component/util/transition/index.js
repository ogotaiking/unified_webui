import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './index.scss';

class TransitionGroup extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <ReactCSSTransitionGroup
                transitionAppear
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={200}
                transitionName="loadComponent"
            >
            
                   {this.props.children}

            </ReactCSSTransitionGroup>
        );
    }
}

export default TransitionGroup;
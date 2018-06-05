import React from 'react';
import { Alert }  from 'antd';

class ErrorBox extends React.Component {
    render() {

      return  <Alert message={this.props.title} 
                    description={this.props.message} 
                    type="error"
                    showIcon
        />;
    }
}

export  default ErrorBox;
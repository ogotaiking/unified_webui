import React from 'react';
import { Spin }  from 'antd';

class LoadingBox extends React.Component {
    render() {
        const divStyle = {
            textAlign: 'center',
            background: 'rgba(0,0,0,0.05)',
            borderRadius: '4px',
            marginBottom: '20px',
            padding: '30px 50px',
            margin: '20px 0'
      };
      return (<div style={divStyle}> <Spin tip="Loading..." /></div>);
    }
}

export  default LoadingBox;
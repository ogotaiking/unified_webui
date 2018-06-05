import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

class LayoutFooter extends React.Component {
  
  render() {
    
    return (
          <Footer style={{ textAlign: 'center' }}>
            Peentos System ©2018 Created by helsman.
          </Footer>
    );
  }
}

export default LayoutFooter;

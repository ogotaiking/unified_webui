import React from 'react';
import { Layout } from 'antd';
import LayoutSiderMenu from './siderMenu';
import LayoutFooter from './footer';
import LayoutHeader from './header';
import NarrowLayoutHeader from './s_header';
import Logo  from './logo';
import TransitionAnimation from '../../component/util/transition';

const {  Content,  Sider } = Layout;

class ClientLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }
  

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  render() {
    //console.log(window.screen.width);
    if (window.screen.width < 1100) {
      return (
        <TransitionAnimation>
        <Layout style={{ minHeight: '100vh' }}>
          <Layout>
              <NarrowLayoutHeader username={this.props.username} userpriv={this.props.userpriv} />
              <Content style={{ margin: '0 16px' }}>
              {this.props.children} 
            </Content>
            <LayoutFooter />
          </Layout>
        </Layout>
        </TransitionAnimation>
      );
    }
    
    return (
      <TransitionAnimation>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}  >
            <Logo collapsed={this.state.collapsed} />
            <LayoutSiderMenu userpriv={this.props.userpriv}/>
       </Sider>
        <Layout>
            <LayoutHeader username={this.props.username} userpriv={this.props.userpriv} />
            <Content style={{ margin: '0 16px' }}>
            {this.props.children} 
          </Content>
          <LayoutFooter />
        </Layout>
      </Layout>
      </TransitionAnimation>
    );
  }
}

export default ClientLayout;
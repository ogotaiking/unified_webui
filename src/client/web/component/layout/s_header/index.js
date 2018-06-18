import React from 'react';
import {  Layout, Menu,Icon,Modal } from 'antd';
import {  Redirect,NavLink } from 'react-router-dom';
import HeaderMenuConfig from '../../menuconfig/headerMenu';
import SiderMenuConfig from '../../menuconfig/siderMenu';
import Logo from '../logo';

import './header.scss';


const UserMenuConfig = HeaderMenuConfig.find((element)=>{return element.key == 'user';});

const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const confirm = Modal.confirm;

class LayoutHeader extends React.Component {
  constructor(props) {
    super(props);
    const userparent ={
      path : '/user'
    };
    this.state = {
      redirectToLogout: false,
      sidermenujsx : this.MenuConfigToJSX(SiderMenuConfig,this.props.userpriv,null),
      headermenujsx : this.MenuConfigToJSX(HeaderMenuConfig,this.props.userpriv,null),
      usermenujsx : this.MenuConfigToJSX(UserMenuConfig.children,this.props.userpriv,userparent)
    };
    this.LogOutConfirm = this.LogOutConfirm.bind(this);    
  }


  LogOutConfirm () {
    confirm({
      title: "是否退出系统?",
      content: '继续退出请点击[确认]按钮，或者取消',
      okText:"确认",
      cancelText:"取消",
      onOk:()=>{
        this.setState({
            redirectToLogout: true
        });
      },
      onCancel() {},
    });
  }



  MenuConfigToJSX(dataSource,userpriv,parent) {
    return (
      dataSource.map((menu, index) => {
        //在普通循环中去掉UserMenu的parse，但是对于Usermenu本身，
        //递归函数的parent不为空，所以可以继续处理
        if ((menu.key=='user') && (!parent) ){
          return ;
        }

        //process PrivilegeLevel, if not config set to min(0).
        let privilegeLevel = 0;
        if (menu.priv)
            privilegeLevel = menu.priv;
        if (privilegeLevel > userpriv) {
          return ;
        }
  
        //process Link URL by key
        let current_prefix = "";
        if ( parent!= null ) {
          current_prefix = parent.path ;
        }
        menu.path = current_prefix +"/"+ menu.key;
        menu.realkey = current_prefix + "_" + menu.key;
  
        if (menu.children) {
          let title = <span>{menu.name}</span>;
          if (menu.icon) {
            title = <span><Icon type={menu.icon} /><span>{menu.name}</span></span>;
          } 
          return (
            <SubMenu key={menu.realkey} title={title}>
              {this.MenuConfigToJSX(menu.children,userpriv,menu)}
            </SubMenu>
          );
        } else {
          return (<Menu.Item key={menu.realkey}>
                      <NavLink to={menu.path}>{menu.icon && <Icon type={menu.icon}/>}<span>{menu.name}</span></NavLink>
                  </Menu.Item>
           );
        }
      })
    );
  }

  render() {
    const {  redirectToLogout } = this.state;
    if (redirectToLogout) {
      return <Redirect to = "/logout" /> ;
    }     

    const userMenu = (
      <SubMenu title={<span><Icon type="user"/>{this.props.username}</span>}>
          {this.state.usermenujsx}
          <Menu.Divider />
          <Menu.Item onClick={this.LogOutConfirm}><Icon type="logout" /><span>退出系统</span></Menu.Item>
      </SubMenu>);

    return ( 
      <div ><Logo/>
         <div className="z-layout-header" >
         <Menu className="header-menu" mode="horizontal">
          {userMenu}
          {this.state.headermenujsx}
          {this.state.sidermenujsx}
         </Menu>
        </div>
        </div>        
      );
  }
}

export default LayoutHeader;

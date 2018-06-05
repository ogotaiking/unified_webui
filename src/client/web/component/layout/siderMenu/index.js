import React from 'react';
import { NavLink } from 'react-router-dom';
import {  Menu, Icon } from 'antd';

import MenuConfig from '../../menuconfig/siderMenu';

const SubMenu = Menu.SubMenu;

class LayoutSiderMenu extends React.Component {

  constructor(props){
    super(props);
    this.state={
      menujsx: this.MenuConfigToJSX(MenuConfig,this.props.userpriv,null)
    };
  }


  MenuConfigToJSX(dataSource,userpriv,parent) {
    return (
      dataSource.map((menu, index) => {
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
    //console.log(this.state.menujsx);
    return (
      <Menu theme="dark"  mode="inline">
      {this.state.menujsx }
      </Menu>
    );
  }
}


export default LayoutSiderMenu;

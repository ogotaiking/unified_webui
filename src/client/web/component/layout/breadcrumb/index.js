import React from 'react';
import { Link,withRouter} from 'react-router-dom';
import { Breadcrumb,Icon} from 'antd';
import './index.scss';

import headerMenu from '../../menuconfig/headerMenu';
import sidebarMenu from '../../menuconfig/siderMenu';

const MenuList = [...headerMenu,...sidebarMenu];

class LayoutBreadcrumb extends React.Component {
  render() {
    let pathlist = this.props.location.pathname.replace(/\/+/g,',').split(',');
    let BreadcrumbList = [];

    let node = MenuList;
    let nodelink = "";
    let itemJSX = null;
    for(let idx = 1,pathlist_length = pathlist.length ; idx < pathlist_length ; idx++) {
      let pathname = pathlist[idx];
      //逐级匹配
      let isFind = false;
      if (!node) {
        break;
      }
      for(let n_idx = 0,n_length = node.length; n_idx < n_length ; n_idx++ ){
        if ( node[n_idx].key === pathname ) {
            isFind = true;
            nodelink = nodelink +"/"+ pathname;
            /*
            if (!node[n_idx].icon) {
              itemJSX = (
                <Breadcrumb.Item key={nodelink}>  <Link to={nodelink} > {node[n_idx].name} </Link> </Breadcrumb.Item>
              );
            } else {
              itemJSX = (
                <Breadcrumb.Item key={nodelink}>  <Link to={nodelink} > <Icon type={node[n_idx].icon} style={{ fontSize: 12 }}/> {node[n_idx].name} </Link> </Breadcrumb.Item>
              );
            }*/

            itemJSX = (
              <Breadcrumb.Item key={nodelink}>  <Link to={nodelink} > {node[n_idx].name} </Link> </Breadcrumb.Item>
            );

            BreadcrumbList.push(itemJSX);
            //don't have children, break with node null
            if(!node[n_idx].children) {
              node = null;
              break;
            } else {
              //has children , reset node for nextround search..
              node = node[n_idx].children;
              break;
            }
        }
        if(!node) {
          break;
        }          
      }
      if (!isFind) {
        break;
      }
    }

    /*
    if (pathlist != null) {
      BreadcrumbList = pathlist.map( (item,index)=>  
           <Breadcrumb.Item key={index}>  <Link to={item.link} > {item.name} </Link> </Breadcrumb.Item>
        );
    } */
    return (
            <Breadcrumb className="Breadcrumb" >
                <Breadcrumb.Item key="home">  
                  <Link to="/" ><Icon type="home" style={{ fontSize: 16 }}/></Link>
                </Breadcrumb.Item>
              { BreadcrumbList }
            </Breadcrumb>
    );
  }
}

export default withRouter(LayoutBreadcrumb);

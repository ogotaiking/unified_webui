import React from 'react';
import { Link,withRouter} from 'react-router-dom';
import { Breadcrumb,Icon} from 'antd';
import './index.scss';

class LayoutBreadcrumb extends React.Component {
  render() {
    let pathlist = this.props.pathlist;
    const { match,location,history } = this.props;
    console.log("Match",match);
    console.log("Location",location);
    console.log("History",history);

    let BreadcrumbList = null;
    if (pathlist != null) {
      BreadcrumbList = pathlist.map( (item,index)=>  
           <Breadcrumb.Item key={index}>  <Link to={item.link} > {item.name} </Link> </Breadcrumb.Item>
        );
    } 
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

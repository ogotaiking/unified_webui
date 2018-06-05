import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

/**
 * 定义Logo组件
 */
class Logo extends React.PureComponent {
  render() {
    return (
      <div className={this.props.collapsed ? "logo-collapsed" : "logo-normal"}>
        <Link to="/" className="logo-font"> {this.props.collapsed ? 'PT' : 'PeentOS' } </Link>
      </div>
    );
  }

}

export default Logo;

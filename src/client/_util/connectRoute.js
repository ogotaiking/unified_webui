import React from "react";

//用于redux-react在某些特殊情况下优化部分组件不更新
export default function connectRoute(WrappedComponent) {
  return class ConnectRoute extends React.Component {
    shouldComponentUpdate(nextProps) {
      return nextProps.location !== this.props.location;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

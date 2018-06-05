import React from 'react';


class AutoFocusTextInput extends  React.Component {
    constructor(props) {
        super(props);
    
        this.inputRef = React.createRef();
      }
      componentDidMount() {
        this.inputRef.current.focus();
      }
      
      render() {
        return <input type="text" ref={this.inputRef} />;
      }
    

    }
export default AutoFocusTextInput;

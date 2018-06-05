import React from 'react';

class MyES7 extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number : 0
        };
        //标准做法，不用每次render时创建新的callback function
        //但是要为每个function在构造函数中添加如下一句
        this.handleClick = this.handleClick.bind(this);
    }

    //如果不想在构造函数中bind，可以写成 ES7 Property initializer syntax自动bind模式
    // handleClick = (event) => { 
    handleClick (event) {
        const number= this.state.number +1;
        this.setState({
            number : number
        });
    }

    render (){
        return (
            <div>
            <div>{this.state.number}</div>
            <button onClick={this.handleClick} >
            click</button>
           </div>
        );
    }
}

export default MyES7;

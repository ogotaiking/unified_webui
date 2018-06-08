import React            from 'react';
import { withApollo } from 'react-apollo';
import LayoutContent from '../../component/layout/content';




class Home extends React.Component{

    render() {    
        return (
               <LayoutContent>Hello World. This is home page.
               </LayoutContent>
        );
    } 
}
export default withApollo(Home);


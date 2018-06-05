import DeviceInfo from 'react-native-device-info';

import React from 'react';

import {
    bindActionCreators
} from "redux";
import {
    connect
} from "react-redux";
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {
    Button
} from 'antd-mobile';

import {
    actions as authActions,
    getLoggedUser
} from "../../_service/reduxstore/modules/auth";



import StockHQ from '../../_service/sina_hq/stock';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientinfo: {},
            clientfp: '',
            redirectToReferrer: false
        };
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        //console.log('GET-Derived:',nextProps);
        let result = {};

        if (prevState.clientfp =='') {
            result.clientfp = DeviceInfo.getUniqueID();
        }
        if ((!prevState.redirectToReferrer) && (nextProps.user.get("uid"))) {
            result.redirectToReferrer = true;
        }
        if ( result != {} ) {
            return result;
        } else {
            return null;
        }
    }

    render() {
        return (

            <View> 
                <Button type = "primary"
            onClick = {
                () => {
                    this.props.login("user", "pwd", "bbbbb");
                }
            } > Login </Button> 
            </View>
        );
    }
}



const mapStateToProps = (state, props) => {
    return {
        user: getLoggedUser(state)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        ...bindActionCreators(authActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
import axios from 'axios';
import Immutable from "immutable";
import {
  actions as appActions
} from "./app";
import url from '../../../_api';
import LocalStorage from '../../../_util/localstorage';

const _localstorage = new LocalStorage();

const initialState = Immutable.fromJS({
  uid: null,
  username: null,
  email: null,
  locale: "en",
  role: null,
  token: null,
  privilegeLevel: -1 //-1:表示未登录状态，因此登陆可以判断if privlegeLevel < 0 , request auth.
});

// action types
export const types = {
  LOGIN: "AUTH/LOGIN", //登录
  LOGOUT: "AUTH/LOGOUT", //注销
  UPDATESTORE: "AUTH/UPDATESTORE"
};

// action creators
export const actions = {
  // 异步action，执行登录验证
  login: (userid,password,clientfp) => {
    
    return dispatch => {
      // 每个API请求开始前，发送app模块定义的startRequest action
      dispatch(appActions.startRequest());
      const params = {userid, password,clientfp};
      return axios.post(url.login(), params).then(response => {
        //console.log("Authentication Result:", response.data);
        // 每个API请求结束后，发送app模块定义的finishRequest action
        dispatch(appActions.finishRequest());
        // 请求返回成功，保存登录用户的信息，否则，设置全局错误信息
        if (response.data.status == "success") {
          //_localstorage.setStorage('AUTH_TOKEN',response.data.token);
          dispatch(actions.setLoginInfo(response.data));
        } else {
          dispatch(appActions.setError(response.data.errmsg));
        }
      }).catch(error => {
        //请求错误，但是请求已经结束,重置Pending计数器
        dispatch(appActions.finishRequest());
        //将Error消息抛出
        dispatch(appActions.setError(error.toString()));
      });
    };
  },

  requestlogout: (token,clientfp) => {
    return dispatch => {
      // 每个API请求开始前，发送app模块定义的startRequest action
      dispatch(appActions.startRequest());    
      const params = { clientfp};
      return axios.post(url.logout(),params,{
        headers: {
            "Authorization" : token,
        }
      }).then(response => {
        console.log("Logout Result:", response.data);
        // 每个API请求结束后，发送app模块定义的finishRequest action
        dispatch(appActions.finishRequest());
        // 请求返回成功，保存登录用户的信息，否则，设置全局错误信息
        if (response.data.status == "success") {
          //_localstorage.removeStorage('AUTH_TOKEN');
          dispatch(actions.logout());
        } else {
          dispatch(appActions.setError(response.data.errmsg));
        }
      }).catch(error => {
        //请求错误，但是请求已经结束,重置Pending计数器
        dispatch(appActions.finishRequest());
        //将Error消息抛出
        dispatch(appActions.setError(error.toString()));
        //同时还是将客户端的auth store删除，因为用户已经确认登出了。
        dispatch(actions.logout());
      });
    };
  },

  reinitstore: () => {  
    return dispatch => {
      // 每个API请求开始前，发送app模块定义的startRequest action
      dispatch(appActions.startRequest());
      return axios.post(url.updatetoken()).then(response => {
        //console.log("Authentication Result:", response.data);
        // 每个API请求结束后，发送app模块定义的finishRequest action
        dispatch(appActions.finishRequest());
        // 请求返回成功，保存登录用户的信息，否则，设置全局错误信息
        if (response.data.status == "success") {
          //_localstorage.setStorage('AUTH_TOKEN',response.data.token);
          dispatch(actions.updateStore(response.data));
          return "success";
        } else {
          //dispatch(appActions.setError(response.data.errmsg));
          return "error";
        }
      }).catch(error => {
        //请求错误，但是请求已经结束,重置Pending计数器
        dispatch(appActions.finishRequest());
        //将Error消息抛出
        //dispatch(appActions.setError(error.toString()));
        return "error";
      });
    };
  },


  
  logout: () => ({
    type: types.LOGOUT
  }),
  setLoginInfo: (userInfo) => ({
    type: types.LOGIN,
    uid: userInfo.uid,
    username: userInfo.username,
    email: userInfo.email,
    locale: userInfo.locale,
    token: userInfo.token,
    role: userInfo.role,
    privilegeLevel: userInfo.privilegeLevel,
  }),
   updateStore: (userInfo) => ({
    type: types.UPDATESTORE,
    uid: userInfo.uid,
    username: userInfo.username,
    email: userInfo.email,
    locale: userInfo.locale,
    token: userInfo.token,
    role: userInfo.role,
    privilegeLevel: userInfo.privilegeLevel,
  })
};

// reducers
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN:
      return state.merge({
        uid: action.uid,
        username: action.username,
        email: action.email,
        locale: action.locale,
        token: action.token,
        role: action.role,
        privilegeLevel: action.privilegeLevel
      });
    case types.LOGOUT:
      return state.merge({
        uid: null,
        username: null,
        email: null,
        locale: "en",
        token: null,
        role: null,
        privilegeLevel: -1
      });
    case types.UPDATESTORE:
      return state.merge({
        uid: action.uid,
        username: action.username,
        email: action.email,
        locale: action.locale,
        token: action.token,
        role: action.role,
        privilegeLevel: action.privilegeLevel
      });
      
    default:
      return state;
  }
};

export default reducer;

// selectors
export const getLoggedUser = state => {
  return state.get("auth");
};
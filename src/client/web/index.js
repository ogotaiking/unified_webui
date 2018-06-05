import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {ApolloProvider } from 'react-apollo';
import { persistStore } from 'redux-persist-immutable';
import configureStore from "../_service/reduxstore/configureStore";

import apolloclient from '../_service/apolloclient';
import App from "./containers/app";


const store = configureStore();
//persistStore(store);

ReactDOM.render(
  
  <ApolloProvider client={apolloclient}>  
     <Provider store={store} >
        <App />
    </Provider>
  </ApolloProvider>   
  
  ,
  document.getElementById("app")
);

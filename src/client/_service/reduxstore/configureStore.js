import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import {  autoRehydrate } from 'redux-persist-immutable';
import rootReducer from "./modules";
import {logger , timeoutScheduler } from './middleware';

let finalCreateStore;
if (process.env.NODE_ENV !== "production" && window.__REDUX_DEVTOOLS_EXTENSION__ ) {
  finalCreateStore = compose(
    autoRehydrate(),
    applyMiddleware(timeoutScheduler,thunk),
    //applyMiddleware(timeoutScheduler,thunk,logger),
    // Required! Enable Redux DevTools with the monitors you chose
    window.__REDUX_DEVTOOLS_EXTENSION__()
  )(createStore);
} else {
  finalCreateStore = compose(
    autoRehydrate(),
    applyMiddleware(thunk)
    //applyMiddleware(thunk,logger)
  )(createStore);
}

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer,initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./modules", () =>
      store.replaceReducer(require("./modules"))
    );
  }

  return store;
}

/**
 * 记录所有被发起的 action 以及产生的新的 state。
 */
export const logger = (store) => next => action => {
    console.group(action.type);
    console.info('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    console.groupEnd(action.type);
    return result;
  };
  

  /**
   * 用 { meta: { delay: N } } 来让 action 延迟 N 毫秒。
   * 在这个案例中，让 `dispatch` 返回一个取消 timeout 的函数。
   */
  export const timeoutScheduler = (store) => next => action => {
    if (!action.meta || !action.meta.delay) {
      return next(action);
    }
  
    const timeoutId = setTimeout(
      () => next(action),
      action.meta.delay
    );
  
    return function cancel() {
      clearTimeout(timeoutId);
    };
  };
  
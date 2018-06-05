const isAuthenticated = (root, args, context, info) => {
    //console.log(context.state);
    if (!context.state.user) {
      return new Error('Not authenticated')
    }
  }

export default isAuthenticated;

'use strict';

import User                from '../../../models/user';
import { authToken } from '../../../auth';

/**使用 Authorization ：Token访问API */
export default (router) => {
  router.get('/info', authToken(), async ctx => {
      if (ctx.isAuthenticated()) {
          const currentUser = await User.findById(ctx.state.user);
          if (currentUser) { 
              ctx.body = {
                  username : currentUser.username,
                  email : currentUser.email,
                  locale: currentUser.locale,
                  role : currentUser.role,
                  privilegeLevel : currentUser.privilegeLevel
              }; 
          } else {
              ctx.body = {
                  status : 'error',
                  errocde : '500',
                  errmsg : 'internal error'
              };  
          }
        } else {
          ctx.body = {
            status : 'error',
            errocde : '401',
            errmsg : 'invalid access.'
        };  
        }         
    });

    /**
    router.get('/user/me/priv', authToken(['admin'],0), async ctx => {
      const currentUser = await User.findById(ctx.state.user);
      if (currentUser) { 
        
        ctx.body = {
          username : currentUser.username,
          email : currentUser.email,
          locale: currentUser.locale,
          role : currentUser.role,
          privilegeLevel : currentUser.privilegeLevel
        }; 
      }
    })
     */

};

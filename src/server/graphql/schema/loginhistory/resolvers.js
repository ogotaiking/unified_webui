/* User Resolvers */
import { combineResolvers } from 'graphql-resolvers'
import isAuthenticated from '../../auth';
import LoginHistory from '../../../models/loginhistory';



const loginhistory_query = async (root, args, ctx, info) =>{
  //console.log(ctx.state.user);
  let result = await LoginHistory.find({ "uid": ctx.state.user._id}).sort({'createTime':-1});
  result.map((item)=>{
    //let conti_span = '';
    let city_span = '';
    //if (item.continent!=='') { conti_span = '/'; }
    if (item.city!=='') { city_span = '/'; }
    //item.login_city =item.continent + conti_span + item.region + city_span + item.city;   
    item.login_city = item.region + city_span + item.city;   
    item.spname = item.asname+'(AS:'+item.asn.toString()+')';
  });
  return result;
}

const resolvers = {
  Query: {
    loginhistory_query: combineResolvers(isAuthenticated,loginhistory_query),
    
    loginhistory_query_by_cookie: async (root, data, ctx, info) => {
        return await LoginHistory.find(data);
    }
  },
};

export default resolvers;
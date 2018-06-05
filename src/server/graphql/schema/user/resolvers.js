/* User Resolvers */
import UserSchema from '../../../models/user';

const resolvers = {
  Query: {
    user_query: async (root, args, ctx, info) =>{
      if (!ctx.state.user) {
        return null;
      }
      return await UserSchema.find({ "_id": ctx.state.user._id});
    },
    user_query_by_name: async (root, data, context) => {
        return await UserSchema.find(data);
    }
  },
};

export default resolvers;
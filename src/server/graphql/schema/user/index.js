'use strict';


import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './type';
import resolvers from './resolvers';

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
export default schema;
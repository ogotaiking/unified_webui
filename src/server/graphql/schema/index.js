'use strict';

import { mergeSchemas } from 'graphql-tools';
import sub_schema from './test_subscription';
import stock_hq from './stock_hq';
import user_schema from './user';
import loginhistory_schema from './loginhistory';

const schema = mergeSchemas({
    schemas:[
        sub_schema,
        user_schema,
        loginhistory_schema,
        stock_hq
    ],
});

export default schema;
'use strict';

import koaBody from 'koa-bodyparser';
import koaRouter from 'koa-router';
import {
    graphqlKoa,
    graphiqlKoa
} from 'apollo-server-koa';
import url from 'url';
import { authToken,isAuthenticated } from '../../auth';
import {ServerConfig} from '../../../../config';
import GraphQLSchema from '../schema';

const router = new koaRouter();

export default (router) => {
    router.post('/graphql',
        //authToken(),
        isAuthenticated(),
        koaBody(), 
        (ctx, next) => graphqlKoa({ 
                            schema: GraphQLSchema, 
                            context: ctx 
                        })(ctx, next)
    );
    
    router.get('/graphql',
        //authToken(),
        isAuthenticated(),
        koaBody(), 
        (ctx, next) => graphqlKoa({ 
                            schema: GraphQLSchema, 
                            context: ctx 
                        })(ctx, next)
    );
  
    //remove iql debug tool on production
    if (!ServerConfig.production) {
        router.get('/graphiql',isAuthenticated(), graphiqlKoa(
            (ctx) => ({
                endpointURL: '/api/graphql',
                subscriptionsEndpoint: url.format({
                    host: ctx.request.header.host,
                    protocol: 'wss', // todo may need some code to check https:wss:ws
                    pathname: '/api/graphql_sub'
                  })
            })
        ));
    }
};
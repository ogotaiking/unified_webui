import { ApolloLink, split } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import url from '../../_api';

const graphqlHTTP_URI = url.graphql_http();
const graphqlWS_URI = url.graphql_ws();

const httpLink = new HttpLink({ 
  uri: graphqlHTTP_URI,
  credentials: 'same-origin' 
});

/* 使用Token并存储在localstorage可能不安全，因此只是在此处留下注释

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('AUTH_TOKEN');
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader,
    },
  })
  return forward(operation);
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)
*/

const wsLink = new WebSocketLink({
  uri: graphqlWS_URI,
  credentials: 'same-origin',
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem('AUTH_TOKEN'),
    },
  }
})


// create my middleware using the applyMiddleware method from subscriptions-transport-ws
const subscriptionMiddleware = {
  applyMiddleware (options, next) {
    console.log(options);
    next();
  }
}
// add the middleware to the web socket link via the Subscription Transport client
wsLink.subscriptionClient.use([subscriptionMiddleware])


const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
  //httpLinkWithAuthToken,
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  //connectToDevTools: true, #debug for apollo connection
});

export default client;
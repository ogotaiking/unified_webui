# Koa2 + React 框架

session持久化采用了redis
user认证数据库采用了mongodb

koa相关的认证代码和API参考了
https://github.com/ersuryapurohit/koa2-passport-mongoose.git

GraphQL subscription 参考了

https://github.com/mikesparr/tutorial-graphql-subscriptions-redis
https://www.linkedin.com/pulse/realtime-notifications-graphql-subscriptions-client-redis-mike-sparr

注意：如果后期切换为mqtt（更容易部署在IOT环境），那么注意将不用的 graphql-redis-subscriptions pkg移除，并添加graphql-mqtt-suscriptions pkg

2 browser open graphiql :
one subscribe 
"
subscription {
  messageAdded {
    id
    content
  }
}
"

another 
"
mutation {
  addMessage(message: "hello")
}
"




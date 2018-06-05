# Unified WebUI 框架

这是一个通用的管理类（Admin）前端框架，采用了React作为Web端，React-native作为移动端。后端采用了将Node.JS（Koa2）作为一个中间件层，支持Oauth和其它认证工作，并提供Restful API/websocket/GraphQL等多种前端获取数据的接口。
所有接口的鉴权和认证在这个中间件层处理，而一些复杂的AI算法和其它业务逻辑则根据后端语言和数据处理方式，使用MessageQueue和Node.JS这个中间件层通信。

## Auth

支持JWT和Session Cookie两种方式， 个人更多的倾向于采用cookie的方式，并将web服务器升级到了https，并将cookie设置为http-only/SameSite-Strict/Secure.
session持久化采用了redis,user认证数据库采用了mongodb.

koa相关的认证代码和API参考了
https://github.com/ersuryapurohit/koa2-passport-mongoose.git


## 数据接口

GraphQL subscription 参考了
https://github.com/mikesparr/tutorial-graphql-subscriptions-redis
https://www.linkedin.com/pulse/realtime-notifications-graphql-subscriptions-client-redis-mike-sparr

注意：如果后期切换为mqtt（更容易部署在IOT环境），那么注意将不用的 graphql-redis-subscriptions pkg移除，并添加graphql-mqtt-suscriptions pkg




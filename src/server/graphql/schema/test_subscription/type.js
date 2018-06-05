const Message_Type = `
type Message {
    id: String!
    content: String
}
type Query {
  messages: [Message!]!
}
type Mutation {
  addMessage(message: String!): [String!]!
}
type Subscription {
  messageAdded: Message
}
`;

export default Message_Type;

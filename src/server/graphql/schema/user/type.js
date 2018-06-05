const User_Type = `
    type User {
        _id: String
        email: String
        username: String
        phone: String
        role: String
        privilegeLevel: Int
        locale: String
        clientinfo: [ClientInfo]
    }
    type ClientInfo {
        clientfp :String
        cookie : String
    }
    type Query {
        user_query : [User!]!
        user_query_by_name(username: String!): [User!]!
    }
`;

export default User_Type;
const LoginHistory_Type = `
    type LoginHistory {
        _id: String
        createTime: String
        cookie: String
        uid: String
        clientfp: String
        username: String
        user_agent: String
        ip: String
        login_city: String
        location: GEO_LOCATION
        spname: String

    }
    type GEO_LOCATION {
        accuracy_radius: Float
        longitude: Float
        latitude : Float
        time_zone: String
    }
    type Query {
        loginhistory_query : [LoginHistory!]!
        loginhistory_query_by_cookie(cookie: String!): [LoginHistory!]!
    }
`;

export default LoginHistory_Type;

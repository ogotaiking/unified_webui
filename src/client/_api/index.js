let Server_IP_PORT ;
if (process.env.NODE_ENV !== "production" ) {
    Server_IP_PORT = "192.168.200.200:8000";  //Webpack
} else {
    Server_IP_PORT = "173.39.145.55";  //NODE.JS 
}

//const HTTP_PROTOCOL = "http";   
//const WEBSOCKET_PROTOCOL = "ws";
const HTTP_PROTOCOL = "https";   
const WEBSOCKET_PROTOCOL = "wss";

let HTTP_URL_HDR = HTTP_PROTOCOL + "://" + Server_IP_PORT ;
let WS_URL_HDR = WEBSOCKET_PROTOCOL + "://"+ Server_IP_PORT;

export default {
    login: () => HTTP_URL_HDR + "/auth/login",
    logout: () => HTTP_URL_HDR + "/auth/logout",
    updatetoken: () => HTTP_URL_HDR + "/auth/token",
    graphql_http: () => HTTP_URL_HDR + "/api/graphql",
    graphql_ws: () => WS_URL_HDR + "/api/graphql_sub",
};
  

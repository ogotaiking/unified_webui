let Server_IP_PORT ;
if (process.env.NODE_ENV !== "production" ) {
    Server_IP_PORT = "192.168.1.222:8000";  //Webpack
} else {
    Server_IP_PORT = "192.168.1.222:3000";  //NODE.JS 
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
  
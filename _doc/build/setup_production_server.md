
#  Basic Env
```bash
sudo apt-get -y update
sudo apt-get upgrade

sudo apt-get install -y openssh-server
sudo apt-get -y install build-essentials vim git make
```

#  Install Node.JS  & Ngnix  & Mongodb 

```bash
sudo apt-get install -y curl gawk
```

## Node.JS

```bash
curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -
sudo sh -c "echo deb https://deb.nodesource.com/node_10.x bionic main > /etc/apt/sources.list.d/nodesource.list"
sudo apt-get update
sudo apt-get install -y nodejs
```

## MongoDB
```bash
wget -qO- https://www.mongodb.org/static/pgp/server-3.6.asc | sudo apt-key add
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list

sudo apt-get update
sudo apt-get install -y mongodb-org

sudo systemctl start mongod
sudo systemctl status mongod
sudo systemctl enable mongod
```

## 修改MongoDB密码

```bash
mongo
```

```json
server> mongo 

use admin
db.createUser(
  {
    user: "admin",
    pwd: "adminpassword",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)

use webdb
db.createUser(
  {
    user: "SimpleUser",
    pwd: "Password",
    roles: [ { role: "readWrite", db: "webdb" } ]
  }
)

quit()
```

```bash
sudo vi /etc/mongod.conf
```

```config
 添加Security和authorization字段
 . . .
security:
  authorization: "enabled"
 . . . 
 . . .
net:
  port: 27017
  bindIp: 127.0.0.1,IP_of_MongoHost<-如果需要remote访问的话
 . . .
```

### 重启服务
```bash
sudo systemctl restart mongod
sudo systemctl status mongod
```

## Verify Login

```bash
mongo -u admin -p --authenticationDatabase admin
>show dbs;

mongo  mongodb://SimpleUser:Password@localhost/webdb
```


# Install Redis

```bash
sudo apt-get install redis-server

```

## 修改/etc/redis/redis.conf中密码配置
```
sudo vi /etc/redis/redis.conf

requirepass foobared ==> requirepass yourpassword
```

## Restart Redis
```bash
 sudo service redis-server restart
 sudo service redis-server status
```

## Verify

```bash
redis-cli -h 127.0.0.1 -p 6379 -a yourpassword
127.0.0.1:6379>keys *
127.0.0.1:6379>quit
```

# PM2 and Webpack

```bash
sudo  npm install -g webpack pm2 
```

# Install NGNIX as Proxy

```bash
sudo apt-get install -y nginx
```


## Generate Certification File for SSL

```bash
Note: xxxx is the password... modify it in production

sudo mkdir /etc/nginx/cert; cd /etc/nginx/cert
sudo openssl genrsa -des3 -passout pass:xxxx -out server.pass.key 2048
sudo openssl rsa -passin pass:xxxx -in server.pass.key -out server.key
sudo rm server.pass.key
sudo openssl req -new -key server.key -out server.csr
sudo openssl x509 -req -sha256 -days 9365 -in server.csr -signkey server.key -out server.crt
```


## NGnix Proxy for Nodejs on port 3000

```bash
sudo vi /etc/nginx/sites-enabled/default

>> Append <<


    upstream nodejs {
    server 127.0.0.1:3000;
        keepalive 64;
    }
    server {
        listen 443 ssl;
        server_name www.foo.org  foo.org;
        ssl_certificate         /etc/nginx/cert/server.crt;
        ssl_certificate_key     /etc/nginx/cert/server.key;
        ssl_session_timeout  5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers AESGCM:ALL:!DH:!EXPORT:!RC4:+HIGH:!MEDIUM:!LOW:!aNULL:!eNULL;
        ssl_prefer_server_ciphers  on;
        access_log /var/log/nginx/test.log;
        location / {
            proxy_set_header Host             $host;
            proxy_set_header X-Real-IP        $remote_addr;
            proxy_set_header X-Real-Port      $remote_port;
            proxy_set_header X-Forwarded-For  $remote_addr;
            
            proxy_http_version 1.1;
            proxy_pass      https://nodejs;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
```

## 启用Gzip压缩

```bash
sudo vi /etc/nginx/nginx.conf

>> enable the following config <<

        gzip on;
        gzip_disable "msie6";

        gzip_vary on;
        gzip_proxied any;
        gzip_comp_level 6;
        gzip_buffers 16 8k;
        # gzip_http_version 1.1;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;


## Restart Nginx
```bash
sudo service nginx restart
```

# Setup WebServer

```bash
sudo mkdir /opt/webui
sudo chown xxx /opt/webui
sudo chgrp xxx /opt/webui

git clone  https://github.com/ogotaiking/unified_webui.git
```

# 修改服务器配置

```bash
config/index.js
export const ServerConfig = {
    'port': 3000,
    'app_timeout': 5000,
    'allow_sign' : true,
    'nginx_enable': true,
    'production' : true,
};
```

## 修改服务器端密码和认证Key

```bash
config/auth/config.js #use config.js.example as example

----------------------------------------------
export const db_username = '';
export const db_password = '';
export const Server_IP = '0.0.0.0';
export const SessionKeys = ['my-secret-key','security_key2'];
export const cookie_key = 'abc:sess';

export const JWTSignKey = {
    secret: 'my-secret-code',
};
----------------------------------------------
```

```bash
vi /opt/webui/unified_webui/src/client/_api/index.js  

修改Server_IP_Port， 注意如果使用NGINX则不需要包含3000 port，直接配置NGINX外网地址，
这个地址的配置是因为手机端ReactNative需要指定
```

## NPM Install & 打包Client端web代码

```bash
cd /opt/webui/unified_webui/src/client/
npm install
npm run web_build

cd /opt/webui/unified_webui/src/server/
npm install
sudo chown -R $USER:$(id -gn $USER) /home/<$user>/.config
```


## 其它

### 修改用户权限，主要是初始状态下创建管理员账户

```bash
mongo mongouri
db.users.findOneAndUpdate({username:"xxx"},{ $set: {"privilegeLevel":xx}})
```


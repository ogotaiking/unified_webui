Howto generate SelfSign Cert

＃生成私钥key文件
openssl genrsa 2048 > server.key
//
＃通过私钥文件生成CSR证书签名
openssl req -new -key  server.key -out csr.pem
//
＃通过私钥文件和CSR证书签名生成证书文件
openssl x509 -req -days 1365 -in csr.pem -signkey server.key -out server.crt

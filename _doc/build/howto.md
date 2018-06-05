# Build Server code

Notice : Some server config parameters could be change in $Project-ROOT/config folder.
Preinstall Mongodb(User info database), Redis(Session Database)

```bash
git clone xxxxx
cd xxxxx

npm install
npm start
```



# Build Web client 

```bash
cd src/client
npm run web_dev   <-webpack dev server
npm run web_build
```
build file will send to  $Project-ROOT/dist , and node-server will have koa-static middleware link to that folder.

# Build IOS/Android client
brew cask install java android-platform-tools
## Step.1 Modify andorid sdk folder in the following configuration file and export jdk path.

src/client/android/local.properties
```
sdk.dir = /Users/kevin/Library/Android/sdk
```


```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_172.jdk/Contents/Home
```
## Step.2 Build
```bash
cd src/client
react-native run ios
react-native run android
```

## Step.3 Run android build on real-phone
```bash
# adb devices
<device-id>

#react-native run-android
adb -s <device-id>  reserve tcp:8081 tcp:8081
adb reverse tcp:8081 tcp:8081  <-if you only have one android device 

```



## Note:
create-react-native-app could be used with expo on real device. use the following config change bind ip address:

```bash
export REACT_NATIVE_PACKAGER_HOSTNAME='your-ipaddr'
```

## Change Server IP

```
src/client/_api/index.js 
modify BaseURL
```
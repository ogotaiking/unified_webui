# Folder Usage

## Client
path 
```
src/client/
```
### Shared Components and Containers
```
src/client/_component
src/client/_containers
```
### Shared Services and Redux store and utils
```
src/client/_service
src/client/_util
```
### NPM package share 

```
client和Server采用不同的package.json,但是考虑到client端axios/redux等版本一致性， 所以react和react-native共享package.json
```
### React-native Only
```
src/client/ios
src/client/android
src/client/rn_component
src/client/rn_containers
src/client/App.js
src/client/index.js
src/client/app.json
src/client/.flowconfig
src/client/.buckconfig
```

### React Web Only
```
src/client/web
src/client/web_config
```

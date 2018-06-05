import Fingerprint2 from 'fingerprintjs2';
    //获取客户端指纹或收集客户端系统信息，便于调查和防止cookie被盗窃
    //根据个人的情况， 如果在多显示器且分辨率不一致的情况下会导致不同的屏幕打开而产生指纹不同
    //因此如下配置中关闭了对屏幕分辨率的检测

const fp = new Fingerprint2({
    excludeScreenResolution: true,
    excludeAvailableScreenResolution: true
  });

export default fp;
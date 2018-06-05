//处在第一层的对象必须设置icon， 其实是我懒得判断并提取首字符作为collapsed的icon
//反正加了Icon好看些，难道不是么？
//每一个key构成了导航用的URL，有点hack，管他呢～

const UserSettings = {
    key: 'settings', 
    name: '系统设置', 
    icon: 'idcard', 
};

const LoginHistory = {
    key: 'loginhistory',
    name: '登陆记录',
    icon: 'code-o',
};

const UserMenu = [
    UserSettings,
    LoginHistory 
];

export default UserMenu;

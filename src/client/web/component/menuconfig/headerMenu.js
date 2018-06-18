//处在第一层的对象必须设置icon， 其实是我懒得判断并提取首字符作为collapsed的icon
//反正加了Icon好看些，难道不是么？
//每一个key构成了导航用的URL，有点hack，管他呢～

const UserMenu = {
    key: 'user',
    name: 'willupdated_by_system_loginname',
    icon: 'user',
    children: [{
        key: 'settings',
        name: '系统设置',
        icon: 'idcard',
    }, {
        key: 'loginhistory',
        name: '登陆记录',
        icon: 'code-o',
    }]
};

const MODIFY_TRADE_LOG ={
    key: 'edit_tradelog',
    name: '修改交易记录',
    icon: 'database',
    priv: 10,
    children: [{
        key: 'upload_tradelog',
        name: '上传交易信息',
        icon: 'solution',
        priv: 10
    },{
        key: 'edit_hold_tradelog',
        name: '修改持仓数据',
        icon: 'solution',
        priv: 10
    },{
        key: 'edit_clearence_tradelog',
        name: '修改清仓数据',
        icon: 'form',
        priv: 10
    }]
    
};


const FOO = {
    key: 'foo',
    name: 'test',
    icon: 'home',
    priv: 20,
    children: [{
            key: 'option1',
            name: 'Test-Level1',
            icon: 'play-circle',
        },
        {
            key: 'option2',
            name: 'Test_Level2',
            icon: 'android',
        },
        {
            key: 'option3',
            name: '自定义操作',
            icon: 'bulb',
            children: [{
                    key: 'option1',
                    name: 'L3-Option',
                    icon: 'play-circle',
                },
                {
                    key: 'option2',
                    name: 'L3-Option2',
                    icon: 'android',
                },
                {
                    key: 'option3',
                    name: 'L3-Option3',
                    icon: 'bulb',
                },
            ],
        },
    ],
};

const headerMenu = [
    UserMenu,
    MODIFY_TRADE_LOG,
    //FOO
];

export default headerMenu;
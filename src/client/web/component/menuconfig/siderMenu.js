//处在第一层的对象必须设置icon， 其实是我懒得判断并提取首字符作为collapsed的icon
//反正加了Icon好看些，难道不是么？
//每一个key构成了导航用的URL，有点hack，管他呢～

const Hold_Table = {
    key: 'hold_table', 
    name: '持仓列表', 
    icon: 'bulb', 
};

const Clearence_Table = {
    key: 'clearence',
    name: '清算列表',
    icon: 'credit-card',
};

const Future_MD = {
    key: 'future_md',
    name: '期货行情',
    icon: 'dot-chart',
    children: [{
            key: 'commodity',
            name: '商品期货',
            icon: 'play-circle',
        },
        {
            key: 'finance',
            name: '金融期货',
            icon: 'android',
        },
        {
            key: 'enengy',
            name: '能源期货',
            icon: 'bulb',
        },
    ],
};

const Option_MD = {
    key: 'option_md',
    name: '期权行情',
    icon: 'line-chart',
    children: [{
            key: 'option_commodity',
            name: '商品期权',
        },
        {
            key: 'option_stock',
            name: '股票期权',
        },
    ],
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

const sidebarMenu = [
    Hold_Table,
    Clearence_Table,
    //Future_MD,
    //Option_MD,
    //FOO
];

export default sidebarMenu;

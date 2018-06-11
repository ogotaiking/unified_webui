import $ from 'jquery'; 

export function StockMarketDataFetch(hq_list, transmit) {
    let hdr = transmit || 'https';
    let hq_str = hq_list.join(',');
    let hq_result_array = hq_list.map(element => {
        return 'hq_str_' + element;
    });
    let _fetch_url = hdr + "://hq.sinajs.cn/list=" + hq_str;
    return new Promise((resolve,reject) =>{
    $.ajax({
        url: _fetch_url,
        dataType: "script",
        cache: "false",
        type: "GET",
        success: (data) => {
            let result = [];
            hq_result_array.map(e => {
                let stocksymbol = e.split("_")[2];
                result.push(StockMarketDataStrParser(window[e],stocksymbol));
            });
            //console.log(result);
            resolve(result);
        },
        error: function (error) {
            reject(error); 
        }
    });
   });
}
function f_num(x){
    return Number.parseFloat(x).toFixed(1);
}

export function StockMarketDataStrParser(hq_str,stocksymbol) {
    /* 行情字段样本 
    var hq_str_sz300104="乐视网,3.620,3.620,3.740,3.900,3.530,3.740,3.750,
                        93592597,347848108.540,
                        376900,3.740,452500,3.730,836300,3.720,916600,3.710,1479400,3.700, <-Buy Order Queue
                        278600,3.750,446758,3.760,560680,3.770,616400,3.780,968700,3.790, <-Sell Order Queue
                        2018-06-05,13:29:03,00"; <-DateTime
    */
    let result = {};
    let e = hq_str.split(",");
    result.id = stocksymbol;
    result.stockname = e[0]; //股票名称
    result.open = e[1]; //今开盘
    result.lastclose = e[2]; //今开盘
    result.current = e[3]; //当前价
    //有些时候开盘前是没有价格的，所以这时候当前价格以昨收计算
    if (result.current == 0) {
        result.current = result.lastclose;
    }
    result.pricechange = (result.current- result.lastclose).toFixed(3);
    result.pctchange = ((result.pricechange / result.lastclose)* 100.0).toFixed(2) ;

    result.high = e[4]; //最高价
    result.low = e[5]; //最低价
    result.buy = e[6]; //买入价
    result.sell = e[7]; //卖出价
    result.voln =  f_num(e[8]); //成交量
    result.volm = (e[9]/10000).toFixed(1); //成交金额(万元)
    //买一到买五队列
    result.orderbook = {};
    result.orderbook.buy = {};
    //result.orderbook.buy.volume = [f_num(e[10]), f_num(e[12]), f_num(e[14]), f_num(e[16]), f_num(e[18])];
    result.orderbook.buy.volume = [e[10], e[12], e[14], e[16], e[18]];
    result.orderbook.buy.price = [e[11], e[13], e[15], e[17], e[19]];
    //卖一到卖五队列
    result.orderbook.sell = {};
    //result.orderbook.sell.volume = [f_num(e[20]), f_num(e[22]), f_num(e[24]), f_num(e[26]), f_num(e[28])];
    result.orderbook.sell.volume = [e[20], e[22], e[24], e[26], e[28]];
    result.orderbook.sell.price = [e[21], e[23], e[25], e[27], e[29]];

    result.currentdate = e[30]; //当前日期
    result.currenttime = e[31]; //当前时间
    return result;
}

/*
 * 中国指数的获取
 * "s_sh000001","s_sz399001","s_sz399005","s_sz399006","s_sh000300","s_sh510050"
 * 
 * 国际主要指数的获取
 * "int_dji","int_nasdaq","int_sp500","int_nikkei","int_hangseng","int_ftse"
 */

export function StockMarketData_IndexFetch(hq_list, transmit) {
    let hdr = transmit || 'https';
    let hq_str = hq_list.join(',');
    let hq_result_array = hq_list.map(element => {
        return 'hq_str_' + element;
    });
    let _fetch_url = hdr + "://hq.sinajs.cn/list=" + hq_str;
    return new Promise((resolve,reject) =>{
    $.ajax({
        url: _fetch_url,
        dataType: "script",
        cache: "false",
        type: "GET",
        success: (data) => {
            let result = [];
            hq_result_array.map(e => {
                let stocksymbol = e.split("_")[3];
                result.push(StockMarketData_Index_StrParser(window[e],stocksymbol));
            });
            //console.log(result);
            resolve(result);
        },
        error: function (error) {
            reject(error); 
        }
    });
   });
}

export function StockMarketData_Index_StrParser(hq_str,symbol) {
    /* 行情字段样本
     * var hq_str_s_sh000001="上证指数,3110.4770,-3.7285,-0.12,505434,7046235";
     * 
     * var hq_str_int_dji="道琼斯,24799.98,-13.71,-0.06";
     * var hq_str_int_hangseng="恒生指数,31179.049,85.600,0.280%";
     * var hq_str_int_nasdaq="纳斯达克,7637.86,31.40,0.41";
     * var hq_str_int_nikkei="日经指数,22591.11,51.57,0.23";
     */

    let result = {};
    let e = hq_str.split(",");
    result.id = symbol;
    result.stockname = e[0]; //股票or指数名称
    result.current = parseFloat(e[1]).toFixed(3); //当日价格
    result.pricechange = parseFloat(e[2]).toFixed(3); //当日涨跌值
    result.pctchange = parseFloat(e[3]).toFixed(3); //当日涨跌幅%
    if (e.length > 4) {
        result.voln =  parseFloat(e[4]); //成交量（手）
        result.volm = (parseFloat(e[5])/10000).toFixed(2); //成交金额（亿元）
    } else {
        result.voln =  0.0;
        result.volm =  0.0;
    }
    return result;
}

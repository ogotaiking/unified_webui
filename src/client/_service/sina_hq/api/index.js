import $ from 'jquery'; 

export function StockHQFetch(hq_list, transmit) {
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
                let stockcode = e.split("_")[2];
                result.push(StockHQStrParser(window[e],stockcode));
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
export function StockHQStrParser(hq_str,stockcode) {
    /* 行情字段样本 
    var hq_str_sz300104="乐视网,3.620,3.620,3.740,3.900,3.530,3.740,3.750,
                        93592597,347848108.540,
                        376900,3.740,452500,3.730,836300,3.720,916600,3.710,1479400,3.700, <-Buy Order Queue
                        278600,3.750,446758,3.760,560680,3.770,616400,3.780,968700,3.790, <-Sell Order Queue
                        2018-06-05,13:29:03,00"; <-DateTime
    */
    let result = {};
    let e = hq_str.split(",");
    result.code = stockcode;
    result.stockname = e[0]; //股票名称
    result.open = e[1]; //今开盘
    result.lastclose = e[2]; //今开盘
    result.current = e[3]; //当前价
    result.high = e[4]; //最高价
    result.low = e[5]; //最低价
    result.buy = e[6]; //买入价
    result.sell = e[7]; //卖出价
    result.voln =  f_num(e[8]); //成交量
    result.volm = e[9]; //成交金额
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
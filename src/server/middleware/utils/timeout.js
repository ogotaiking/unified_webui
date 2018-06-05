"use strict";

export default function (timeout) {
    return async function (ctx, next) {
        let tmr = null;
        await Promise.race([
            new Promise(function (resolve, reject) {
                tmr = setTimeout(function () {
                    let e = new Error('Request timeout:超时了吧');
                    e.status = 408;
                    reject(e);
                }, timeout);
            }),
            new Promise(function (resolve, reject) {
                (async function () {
                    await next();
                    clearTimeout(tmr);
                    resolve();
                })();
            })
        ])
    }    
}
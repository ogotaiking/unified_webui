/* 
 * Node现阶段还不支持import/export
 * 使用babel-polyfill来支持
 */

require("babel-core/register")({
    presets: ['env']
});

require('./server.js');
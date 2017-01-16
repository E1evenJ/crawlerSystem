/**
 * Created by jiangyun on 2017/1/9.
 */
const BaiduCrawler = require("./baiduCrawler.js");
const cheerio = require('cheerio');//引入jquery实现

const url = 'fm.xinli001.com';

const filterDataFromHtml = function (text, result) {
    const t = text.replace(/[\n\r\t]/gm, '');
    const $ = cheerio.load(t);
    // result.playCount = $('.detailContent_playcountDetail span')[0].children[0].data;
};

const XinliProcess = function () {

};

const start = function (keyword, callback) {
    const o = new BaiduCrawler(url, keyword, callback);

    o.next(function (err, sres, result) {
        if (err) return;
        filterDataFromHtml(sres.text, result);
    });
    o.start();
};

XinliProcess.prototype.start = start;

module.exports = XinliProcess;

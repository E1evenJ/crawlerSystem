/**
 * Created by jiangyun on 2017/1/9.
 */
const cheerio = require('cheerio');//引入jquery实现
const BaiduCrawler = require("./baiduCrawler.js");

const url = 'www.lizhi.fm';

const filterDataFromHtml = function (text, result) {
    const t = text.replace(/[\n\r\t]/gm, '');
    const $ = cheerio.load(t);
    // result.playCount = $('.detailContent_playcountDetail span')[0].children[0].data;
};

const QingtingProcess = function () {

};

const start = function (keyword, callback) {
    const o = new BaiduCrawler(url, keyword, callback);

    o.next(function (err, sres, result) {
        if (err) return;
        filterDataFromHtml(sres.text, result);
    });
    o.start();
};

QingtingProcess.prototype.start = start;

module.exports = QingtingProcess;

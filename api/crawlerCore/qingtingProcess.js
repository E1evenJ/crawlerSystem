/**
 * Created by jiangyun on 2017/1/9.
 */
const Crawler = require("./crawler.js");
const cheerio = require('cheerio');//引入jquery实现

const url = 'www.qingting.fm';

const filterDataFromHtml = function (text, result) {
    const t = text.replace(/[\n\r\t]/gm, '');
    const $ = cheerio.load(t);
    // dataObj.playCount = $('.detailContent_playcountDetail span')[0].children[0].data;
};

const QingtingProcess = function () {

};

const start = function (keyword, callback) {
    const o = new Crawler(url, callback);
    const fistUrl = 'http://neo.qingting.fm/search/all/' + encodeURIComponent(keyword);
    o.next(fistUrl, function (err, sres, result) {
        if (err) return;
        filterDataFromHtml(sres.text, result);
    });
    o.start();
};

QingtingProcess.prototype.start = start;

module.exports = QingtingProcess;

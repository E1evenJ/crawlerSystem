/**
 * Created by jiangyun on 2017/1/9.
 */
"use strict";
const BaiduCrawler = require("./baiduCrawler.js");
const cheerio = require('cheerio');//引入jquery实现
const Crawler = require("./crawler.js");

class XimalayaProcess {

    constructor() {
        this.crawlerId = 'www.ximalaya.com';
        this.soundUrl = 'http://www.ximalaya.com/tracks/';
    }

    getCrawlerId() {
        return this.crawlerId;
    }

    getSoundUrl(soundId) {
        return this.soundUrl + soundId + '.json';
    }

    getSoundTracks(soundId) {
        return new Promise((resolve, reject) => {
            const crawler = new Crawler();
            crawler.next(this.getSoundUrl(soundId), (err, sres, result) => {
                result.data = sres.body;
                resolve(result.data);
            });
            crawler.start();
        });

    }

    start(keyword, callback) {
        const o = new BaiduCrawler(this.crawlerId, keyword, callback);

        o.next(function (err, sres, result) {
            if (err) return;
            filterDataFromHtml(sres, result);
        });
        o.start();
    }
}

const isAlbum = function (url) {
    return url.indexOf('album') > -1;
};

const isSound = function (url) {
    return url.indexOf('sound') > -1;
};

const filterDataFromHtml = function (sres, result) {
    const t = sres.text.replace(/[\n\r\t]/gm, '');
    const $ = cheerio.load(t);
    const targetUrl = sres.redirects[0];

    if (isAlbum(targetUrl)) {
        result.albumArray = [];
        $('.album_soundlist li').each(function (index, item) {
            const sound = {};
            sound.id = $(item).attr('sound_id');
            sound.title = $(item).find('.title').attr('title');
            sound.playCount = $(item).find('span.sound_playcount').text();
            sound.date = $(item).find('.operate span').text();
            result.albumArray.push(sound);
        });
        result.playCount = $('.detailContent_playcountDetail span')[0].children[0].data;
    } else if (isSound(targetUrl)) {
        const re = /\d+/g;
        const numberArray = targetUrl.match(re);
        result.soundId = numberArray[1];
        if (result.soundId != undefined) {
            const soundCountStr = $('.soundContent_playcount')[0].children[0].data;
            result.playCount = soundCountStr.replace(/[^0-9]+/g, '');
        }
    }
};

module.exports = XimalayaProcess;

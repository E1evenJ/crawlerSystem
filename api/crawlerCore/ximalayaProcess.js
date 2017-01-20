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
        this.targetUrlArray = [];
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
            crawler.next(this.getSoundUrl(soundId), (sres, result) => {
                result.data = sres.body;
            });
            crawler.start().then(resolve).catch(reject);
        });

    }

    start(albumArray, keyword) {
        const o = new BaiduCrawler(this.crawlerId, albumArray, keyword);
        let that = this;
        o.next((sres, albumArray) => {
            that.filterDataFromHtml(sres, albumArray);
        });
        return o.start();
    }

    filterDataFromHtml(sres, albumArray) {
        const t = sres.text.replace(/[\n\r\t]/gm, '');
        const $ = cheerio.load(t);
        const targetUrl = sres.redirects[0];
        console.log(targetUrl);
        const album = {};
        album.crawlerId = this.crawlerId;
        album.targetUrl = targetUrl;
        album.soundArray = [];
        if (isAlbum(targetUrl) && isExitTargetUrl(targetUrl, this.targetUrlArray) == false) {
            album.isAlbum = true;
            album.playCount = $('.detailContent_playcountDetail span').text();
            album.name = $('.detailContent_title h1').text();
            album.date = $('.detailContent_category span.mgr-5').text().replace(/[^0-9\-]+/g, '');
            album.picture = $('.detailContent .albumface180 img').attr('src');
            album.soundCount = $('.albumSoundcount').text().replace(/[^0-9]+/g, '');
            this.targetUrlArray.push(targetUrl);
            albumArray.push(album);

        } else if (isSound(targetUrl) && isExitTargetUrl(targetUrl, this.targetUrlArray) == false) {
            album.isAlbum = false;
            const sound = {};
            const re = /\d+/g;
            const numberArray = targetUrl.match(re);
            sound.id = numberArray[1];
            if (sound.id != undefined) {
                sound.title = $('.detailContent h1').text();
                sound.playCount = $('.soundContent_playcount').text().replace(/[^0-9]+/g, '');
                sound.picture = $('.detailContent .soundface180 img').attr('src');
                album.soundArray.push(sound);
            }
            this.targetUrlArray.push(targetUrl);
            albumArray.push(album);
        }
    }

    getSoundList(url) {
        return new Promise((resolve, reject) => {
            const crawler = new Crawler();
            crawler.next(url, (sres, result) => {
                const t = sres.text.replace(/[\n\r\t]/gm, '');
                const $ = cheerio.load(t);
                if (isAlbum(url)) {
                    result.soundArray = [];
                    $('.album_soundlist li').each(function (index, item) {
                        const sound = {};
                        sound.id = $(item).attr('sound_id');
                        sound.title = $(item).find('.title').attr('title');
                        sound.playCount = $(item).find('span.sound_playcount').text();
                        sound.date = $(item).find('.operate span').text();
                        sound.isPaid = $(item).find('.iconpay').length > 0;
                        sound.isFree = $(item).find('.iconpay.tag-pay-border').length == 1;
                        sound.picture = $('.middlePlayer .pin img').attr('src');
                        result.soundArray.push(sound);
                    });
                    result.hasNext = $('.pagingBar_wrapper .pagingBar_page:last-child').attr('rel') == 'next';
                    if (result.hasNext) {
                        result.nextUrl = 'http://' + this.crawlerId + $('.pagingBar_wrapper .pagingBar_page[rel="next"]').attr('href');
                    }
                }
            });
            crawler.start().then(resolve).catch(reject);
        });
    }
}

const isAlbum = function (url) {
    const reg = /http:\/\/www.ximalaya.com\/\d+\/album\/\d+/g;
    return reg.test(url);
};

const isSound = function (url) {
    const reg = /http:\/\/www.ximalaya.com\/\d+\/sound\/\d+/g;
    return reg.test(url);
};

const isExitTargetUrl = function (targetUrl, targetUrlArray) {
    for (let i = 0; i < targetUrlArray.length; i++) {
        if (removeSearch(targetUrlArray[i]) == removeSearch(targetUrl)) {
            return true;
        }
    }
    return false;
};

const removeSearch = function (url) {
    if (url != null && url != '') {
        return url.split('?')[0];
    } else {
        return url;
    }
};

module.exports = XimalayaProcess;

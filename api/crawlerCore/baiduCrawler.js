/**
 * Created by jiangyun on 2017/1/12.
 */
"use strict";
const Crawler = require('./crawler');//引入superagent
const cheerio = require('cheerio');//引入jquery实现
const async = require('async');

const baiduSearch = Symbol('baiduSearch');
class BaiduCrawler extends Crawler {

    constructor(url, keyword, callback) {
        super(url, callback);
        const firstUrl = this.getSearchUrl(url, keyword);
        this.next(firstUrl, this[baiduSearch]);
    }


    getSearchUrl(url, keyword) {
        const searchObj = {
            q1: '',
            q2: keyword,
            q3: '',
            q4: '',
            rn: 10,
            lm: 0,
            ct: 0,
            ft: '',
            q5: 1,
            q6: url,
            tn: 'baiduadv'
        };
        const keys = Object.keys(searchObj);
        let baiduSearchUrl = 'https://www.baidu.com/s?';
        keys.forEach(function (key, index) {
            if (searchObj.hasOwnProperty(key)) {
                if (index == 0) {
                    baiduSearchUrl = baiduSearchUrl + key + '=' + encodeURIComponent(searchObj[key]);
                } else {
                    baiduSearchUrl = baiduSearchUrl + '&' + key + '=' + encodeURIComponent(searchObj[key]);
                }

            }
        });
        return baiduSearchUrl;
    }

    processEnd(err, sres, currentOfArray, _this) {
        const _nextOfArray = _this.nextArray.shift();
        if(_nextOfArray.url instanceof Array){

        }else{
            const crawler = this.__proto__.__proto__;
            if(crawler instanceof Crawler){
                crawler.processEnd(err, sres, currentOfArray, _this);
            }
        }
    }

    superagentGet() {
        const _this = this;
        const currentOfArray = this.nextArray.shift();
        if (currentOfArray.url instanceof Array) {
            if (currentOfArray.url.length > 0) {
                async.each(currentOfArray.url, function (url) {
                    _this.superAgent(url, currentOfArray.options, currentOfArray.callBack);
                }, function (err) {
                    this.processCallback(err, _this.result);
                });
            } else {
                _this.processCallback({message: 'error'}, _this.result);
            }
        } else {
            _this.superAgent(currentOfArray.url, currentOfArray.options, currentOfArray.callBack);
        }
    }

    [baiduSearch](err, sres, result, next, _this) {
        if (err) return;
        const t = sres.text.replace(/[\n\r\t]/gm, '');
        const $ = cheerio.load(t);
        const aTagList = $('.result.c-container .t a');
        const ulrArray = [];

        aTagList.forEach((aTag, index) => {
            const filterATag = filterATag(aTag);
            if (filterATag != null) {
                console.log('targetUrl:' + filterATag.attribs.href);
                ulrArray.push(filterATag);
            }
        });
        if (ulrArray.length > 0) {
            next.url = ulrArray;
        } else {
            _this.stop();
        }
    }
}

function filterATag(aTag) {
    return aTag;
}

module.exports = BaiduCrawler;

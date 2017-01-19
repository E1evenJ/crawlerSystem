/**
 * Created by jiangyun on 2017/1/12.
 */
"use strict";
const Crawler = require('./crawler');//引入superagent
const cheerio = require('cheerio');//引入jquery实现
const async = require('async');

class BaiduCrawler extends Crawler {

    constructor(url, keyword, callback) {
        super(url, callback);
        const firstUrl = this.getSearchUrl(url, keyword);
        this.next(firstUrl, this.baiduSearch);
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
            q5: 0,
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

    processEnd(err, sres, callBack, asyncCallBack) {
        if (this.nextArray[this.nextArrayIndex].url instanceof Array) {
            callBack(err, sres, this.result, this, asyncCallBack);
        } else {
            callBack(err, sres, this.result, this);
            if (err || this.isStart == false) {
                this.processCallback(err, this.result);
            } else {
                this.superagentGet();
            }
        }
    }

    superagentGet() {
        const _this = this;
        const currentOfArray = this.nextArray[++this.nextArrayIndex];
        if (currentOfArray.url instanceof Array) {
            if (currentOfArray.url.length > 0) {
                async.each(currentOfArray.url, function (url, asyncCallBack) {
                    _this.superAgent(url, currentOfArray.options, currentOfArray.callBack, asyncCallBack);
                }, function (err) {
                    _this.processCallback(err, _this.result);
                });
            } else {
                _this.processCallback({message: 'error'}, _this.result);
            }
        } else {
            _this.superAgent(currentOfArray.url, currentOfArray.options, currentOfArray.callBack);
        }
    }

    baiduSearch(err, sres, result, _this) {
        if (err) return;
        const t = sres.text.replace(/[\n\r\t]/gm, '');
        const $ = cheerio.load(t);
        const aTagList = $('.result.c-container .t a');
        const ulrArray = [];

        for(let i=0;i<aTagList.length;i++){
            const filterResult = filterATag(aTagList[i]);
            if (filterResult != null) {
                console.log('targetUrl:' + filterResult.attribs.href);
                ulrArray.push(filterResult.attribs.href);
            }
        }

        if (ulrArray.length > 0) {
            _this.nextArray[_this.nextArrayIndex + 1].url = ulrArray;
        } else {
            _this.stop();
        }
    }
}

function filterATag(aTag) {
    return aTag;
}

module.exports = BaiduCrawler;

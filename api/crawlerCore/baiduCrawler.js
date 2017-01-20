/**
 * Created by jiangyun on 2017/1/12.
 */
"use strict";
const Crawler = require('./crawler');//引入superagent
const cheerio = require('cheerio');//引入jquery实现

class BaiduCrawler extends Crawler {

    constructor(crawlerId, albumArray, keyword) {
        super(albumArray);
        const firstUrl = this.getSearchUrl(crawlerId, keyword);
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

    baiduSearch(sres, albumArray, _this) {
        const t = sres.text.replace(/[\n\r\t]/gm, '');
        const $ = cheerio.load(t);
        const aTagList = $('.result.c-container .t a');
        const ulrArray = [];

        for (let i = 0; i < aTagList.length; i++) {
            const filterResult = filterATag(aTagList[i]);
            const url = $(filterResult).attr('href');
            if (url != null) {
                console.log('targetUrl:' + url);
                ulrArray.push(url);
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

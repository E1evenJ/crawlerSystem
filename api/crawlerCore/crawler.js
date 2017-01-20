/**
 * Created by jiangyun on 2017/1/9.
 */
"use strict";
const superagent = require('superagent');//引入superagent

class Crawler {

    constructor(albumArray) {
        this.nextArray = [];
        this.isStart = false;
        this.albumArray = albumArray;
        this.nextArrayIndex = -1;
    }

    start() {
        this.isStart = true;
        return this.superagentGet();
    }

    stop() {
        this.isStart = false;
    }

    next(url, callBack, options) {
        if (arguments.length == 1) {
            if (typeof url == 'function') {
                this.nextArray.push({url: undefined, callBack: url, options: {}});
            } else {
                throw {message: '参数url期望是function，但实际是' + typeof url}
            }
        } else if (arguments.length >= 2) {
            this.nextArray.push({url: url, callBack: callBack, options: options || {}});
        }
    }

    superagentGet() {
        const _this = this;
        return new Promise((resolve, reject) => {
            const currentOfArray = this.nextArray[++this.nextArrayIndex];
            if (currentOfArray == null) {
                resolve(this.albumArray);
            } else {
                if (currentOfArray.url instanceof Array) {
                    if (currentOfArray.url.length > 0) {
                        async.each(currentOfArray.url, function (url, asyncCallBack) {
                            _this.superAgent(url, currentOfArray.options).then((sres) => {
                                currentOfArray.callBack(sres, _this.albumArray, _this);
                                asyncCallBack();
                            }).catch((error) => {
                                asyncCallBack();
                                console.error(error.message);
                            });
                        }, function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(_this.albumArray);
                            }

                        });
                    } else {
                        resolve({message: 'error'}, _this.albumArray);
                    }
                } else {
                    _this.superAgent(currentOfArray.url, currentOfArray.options).then(function (sres) {
                        currentOfArray.callBack(sres, _this.albumArray, _this);
                        if (_this.isStart == false) {
                            reject({message: 'crawler is stop'});
                        } else {
                            _this.superagentGet().then((albumArray) => {
                                resolve(albumArray);
                            }).catch((error) => {
                                reject(error);
                            });
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                }
            }
        });
    }

    superAgent(url, options) {
        return new Promise((resolve, reject) => {
            superagent
                .get(url)
                .set(Crawler.getHttpSet(options))
                // .set({
                //     'Accept': (currentOfArray.options.headers && currentOfArray.options.headers['Accept']) || 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                //     'Accept-Encoding': (currentOfArray.options.headers && currentOfArray.options.headers['Accept-Encoding']) || 'gzip, deflate, sdch, br',
                //     'Accept-Language': (currentOfArray.options.headers && currentOfArray.options.headers['Accept-Language']) || 'zh-CN,zh;q=0.8,en;q=0.6',
                //     'Cache-Control': (currentOfArray.options.headers && currentOfArray.options.headers['Cache-Control']) || 'no-cache',
                //     'Connection': (currentOfArray.options.headers && currentOfArray.options.headers['Connection']) || 'keep-alive',
                //     'Cookie': (currentOfArray.options.headers && currentOfArray.options.headers['Cookie']) || 'BIDUPSID=A4CA5AABC28940A8BFB4BD8356E28A1A; PSTM=1436410521; BAIDUID=A05E96DCF1B764F696A7DC4A3E16AC94:FG=1; ispeed_lsm=2; MCITY=-289%3A; BD_HOME=0; PSINO=6; H_PS_PSSID=1421_21096_18134; BD_UPN=123253; H_PS_645EC=9e63DmKJEP2ldwv6wev36lvK20ELsnKDLITXMWBc2o4XDQDw%2B6laPPZY2NA; BDSVRTM=0',
                //     'Host': (currentOfArray.options.headers && currentOfArray.options.headers['Host']) || 'www.baidu.com',
                //     'Pragma': (currentOfArray.options.headers && currentOfArray.options.headers['Pragma']) || 'no-cache',
                //     'Upgrade-Insecure-Requests': (currentOfArray.options.headers && currentOfArray.options.headers['Upgrade-Insecure-Requests']) || 1
                //
                // })
                .end(function (err, sres) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(sres)
                    }
                });
        });

    }

    static getHttpSet(options) {
        return {
            'user-agent': (options.headers && options.headers['user-agent']) || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
        }
    }
}

module.exports = Crawler;

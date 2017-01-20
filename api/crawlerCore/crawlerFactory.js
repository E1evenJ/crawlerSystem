/**
 * Created by jiangyun on 2017/1/9.
 */
"use strict";
const async = require('async');

class CrawlerFactory {

    constructor() {
        this.processArray = [];
    }

    addProcess(process) {
        this.processArray.push(process);
    }

    start(keyword) {
        const _albumArray = [];
        return new Promise((resolve, reject) => {
            async.map(this.processArray, function (process, callback) {
                process.start(_albumArray, keyword).then((results) => {
                    callback(null, results)
                }).catch((error) => {
                    callback(error, null);
                });
            }, function (err, albumArray) {
                err && console.log('error:' + err);
                console.log(_albumArray);
                resolve(_albumArray);
            });
        });
    }

    getSoundTracks(soundId, crawlerId) {
        const process = getProcess(this.processArray, crawlerId);
        return process.getSoundTracks(soundId);
    }

    getSoundList(url, crawlerId){
        const process = getProcess(this.processArray, crawlerId);
        return process.getSoundList(url);
    }
}

function getProcess(processArray, id) {
    let process = null;
    processArray.forEach((p) => {
        if (p.getCrawlerId() == id) {
            process = p;
        }
    });
    return process;
}

module.exports = CrawlerFactory;

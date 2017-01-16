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
        return new Promise((resolve, reject) => {
            async.map(this.processArray, function (process, callback) {
                process.start(keyword, callback);
            }, function (err, results) {
                err && console.log('error:' + err);
                console.log(results);
                resolve(results);
            });
        });
    }

    getSoundTracks(soundId, crawlerId) {
        const process = getProcess(this.processArray, crawlerId);
        return process.getSoundTracks(soundId);
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

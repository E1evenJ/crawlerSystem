/**
 * Created by jiangyun on 2017/1/12.
 */
"use strict";
const CrawlerFactory = require('../crawlerCore/crawlerFactory');
const XimalayaProcess = require('../crawlerCore/ximalayaProcess');
const LizhiProcess = require('../crawlerCore/lizhiProcess');
const QingtingProcess = require('../crawlerCore/qingtingProcess');
const XinliProcess = require('../crawlerCore/xinliProcess');

module.exports = {
    search: function (req, res) {
        const searchBean = req.body;
        if (searchBean.keyword == undefined || searchBean.keyword == '') {
            res.serverError({message:'keyword is undefined'});
        } else {
            const crawlerFactory = new CrawlerFactory();
            crawlerFactory.addProcess(new XimalayaProcess());
            // crawlerFactory.addProcess(new LizhiProcess());
            // crawlerFactory.addProcess(new QingtingProcess());
            // crawlerFactory.addProcess(new XinliProcess());

            crawlerFactory.start(searchBean.keyword).then(albumArray =>
                res.json({message: 'success', albumArray: albumArray})
            );
        }
    },

    getSoundTracks: function (req, res) {
        const searchBean = req.body;
        if (searchBean.soundId == undefined || searchBean.soundId == ''
            || searchBean.crawlerId == undefined || searchBean.crawlerId == '') {
            res.serverError();
        } else {
            const crawlerFactory = new CrawlerFactory();
            crawlerFactory.addProcess(new XimalayaProcess());
            // crawlerFactory.addProcess(new LizhiProcess());
            // crawlerFactory.addProcess(new QingtingProcess());
            // crawlerFactory.addProcess(new XinliProcess());
            crawlerFactory.getSoundTracks(searchBean.soundId, searchBean.crawlerId).then((result) => {
                res.json(result.data);
            });
        }
    },

    getSoundList: function (req, res) {
        const searchBean = req.body;
        if (searchBean.url == undefined || searchBean.url == ''
            || searchBean.crawlerId == undefined || searchBean.crawlerId == '') {
            res.serverError();
        } else {
            const crawlerFactory = new CrawlerFactory();
            crawlerFactory.addProcess(new XimalayaProcess());
            // crawlerFactory.addProcess(new LizhiProcess());
            // crawlerFactory.addProcess(new QingtingProcess());
            // crawlerFactory.addProcess(new XinliProcess());
            crawlerFactory.getSoundList(searchBean.url, searchBean.crawlerId).then((result) => {
                res.json(result);
            });
        }
    }
};

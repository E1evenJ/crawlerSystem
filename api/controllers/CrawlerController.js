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
        const crawlerFactory = new CrawlerFactory();
        crawlerFactory.addProcess(new XimalayaProcess());
        // crawlerFactory.addProcess(new LizhiProcess());
        // crawlerFactory.addProcess(new QingtingProcess());
        // crawlerFactory.addProcess(new XinliProcess());

        crawlerFactory.start(searchBean.keyword).then(results => res.json({message: 'success', results: results}));

    },

    getSoundTracks: function (req, res) {
        const searchBean = req.body;
        const crawlerFactory = new CrawlerFactory();
        crawlerFactory.addProcess(new XimalayaProcess());
        // crawlerFactory.addProcess(new LizhiProcess());
        // crawlerFactory.addProcess(new QingtingProcess());
        // crawlerFactory.addProcess(new XinliProcess());
        crawlerFactory.getSoundTracks(searchBean.soundId, searchBean.crawlerId).then((result)=>{
            res.json(result);
        });
    }
};

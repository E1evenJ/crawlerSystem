/**
 * ChatMessageController
 *
 * @description :: Server-side logic for managing Chatmessages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var baseSetting = require('../common/BaseSetting.js');
var co = require('co');
var SocketType = require('../enums/SocketType.js');
var errMessageType = require('../enums/ErrMessageType.js');
var userType = require('../enums/UserType.js')

module.exports = {
    hello: function (req, res) {
        // Have the socket which made the request join the "funSockets" room.
        sails.sockets.join(req, 'funSockets');
        // Broadcast a notification to all the sockets who have joined
        // the "funSockets" room, excluding our newly added socket:
        sails.sockets.broadcast('funSockets', 'message', {howdy: 'hi there!'}, req);
        return res.json({
            anyData: 'we want to send back'
        });


    },
    login: function (req, res) {
        var chatRoomId = req.body.chatRoomId;
        sails.sockets.join(req, chatRoomId);
        console.log('one user login:' + chatRoomId+"======>"+req.socket.id);
        return res.json({
            socketId: req.socket.id
        });
    },
    sendMessage: function (req, res) {
        var chatMessage = req.allParams();
        chatMessage.createTime = new Date().getTime();
        ChatMessage.create(chatMessage).exec(function createCB(err, created) {
            if (err) {
                // 如果有误，返回错误
                return res.serverError(err)
            } else {
                // 否则
                sails.sockets.broadcast(created.chatRoomId, SocketType.Enums.VideoActionType.MESSAGE, created, req);
                return res.json(created);
            }
        });
    },

    getAll: function (req, res) {
        ChatMessage.find({}).exec(function (err, chatMessages) {
            if (err) {
                // 如果有误，返回错误
                res.serverError(err);
            } else {
                res.json(chatMessages);
            }
        })
    },

    //历史聊天记录
    getBeforeMessage: function (req, res) {
        var condition = req.allParams();
        if (condition.createTime == null || condition.createTime == undefined) {
            ChatMessage.find({
                where: {chatRoomId: condition.chatRoomId},
                limit: condition.length,
                sort: 'createTime DESC'
            }).exec(function (err, chatMessages) {
                if (err) res.serverError(err);
                co(function*() {
                    chatMessages = yield  function (callback) {
                        ChatMessageService.filterDeleted(chatMessages, userType.getUserType(condition.appType), callback);
                    }
                    chatMessages = JSON.parse(chatMessages);
                    res.json(chatMessages.result);
                })
            })

        } else {
            ChatMessage.find({
                where: {chatRoomId: condition.chatRoomId, createTime: {'<': condition.createTime}},
                limit: condition.length,
                sort: 'createTime DESC'
            }).exec(function (err, chatMessages) {
                if (err) res.serverError(err);
                co(function*() {
                    chatMessages = yield  function (callback) {
                        ChatMessageService.filterDeleted(chatMessages, userType.getUserType(condition.appType), callback);
                    }
                    chatMessages = JSON.parse(chatMessages);
                    res.json(chatMessages.result);
                })
            })

        }

    },

    //最新消息
    getAfterMessage: function (req, res) {
        var condition = req.allParams();
        co(function*() {
            var chatrooms = yield function (callback) {
                ChatRoom.native(function (err, collection) {
                    if (err) return res.serverError(err);
                    collection.find({'chatUsers.userId': condition.userId}, {}).toArray(function (err, results) {
                        if (err) return res.serverError(err);
                        callback(err, results);
                    });
                });
            }
            var date = baseSetting.getMinDate();
            if (condition.createTime == null || condition.createTime == undefined) {
                if (chatrooms != null) {
                    for (var i in chatrooms) {
                        var obTime = ChatRoomService.obtainActiveTime(chatrooms[i], condition.userId);
                        if (date < obTime) {
                            date = obTime;
                        }
                    }
                }
            } else {
                date = condition.createTime;
            }
            var chatRoomIds = ChatRoomService.getChatRoomIds(chatrooms);
            date = new Date(date);
            var chatMessages = yield function (callback) {
                ChatMessage.find({
                    where: {createTime: {'>': date.getTime()}, chatRoomId: {$in: chatRoomIds}}, limit: 300, sort: 'createTime DESC'
                }).exec(function (err, chatMessages) {
                    if (err) res.serverError(err);
                    callback(err, chatMessages);
                })
            };
            chatMessages = yield  function (callback) {
                ChatMessageService.filterDeleted(chatMessages, userType.getUserType(condition.appType), callback);
            }
            ChatRoomService.updatelastObtain(condition.userId);
            chatMessages = JSON.parse(chatMessages);
            return res.json(chatMessages.result);
        });
    },

    //日期查询聊天记录
    getChatMessagesByDay: function (req, res) {
        var condition = req.allParams();
        var endDate = new Date(condition.date);
        endDate = endDate.setDate(endDate.getDay() + 1).getTime();
        var startDate = new Date(condition.date).getTime();
        ChatMessage.find({
            where: {chatRoomId: condition.chatRoomId, createTime: {'>': startDate, '<': endDate}},
            limit: 2000,
            sort: 'createTime ASC'
        }).exec(function (err, chatMessages) {
            if (err) return res.serverError(err);
            co(function*() {
                chatMessages = yield  function (callback) {
                    ChatMessageService.filterDeleted(chatMessages, userType.getUserType(condition.appType), callback);
                }
                chatMessages = JSON.parse(chatMessages);
                res.json(chatMessages.result);
            })

        })
    },

    //来访者清空聊天室
    deletedChatMessage: function (req, res) {
        var userBean = req.allParams();
        var userArr = [userBean.customerId, userBean.counselorId];
        co(function*() {
            var chatRoom = yield function (callback) {
                ChatRoomService.isExist(userArr, callback);
            };
            chatRoom = JSON.parse(chatRoom)
            if (chatRoom != null) {
                ChatMessage.update({
                        chatRoomId: chatRoom.result.id,
                        customerDeleted: {$in: [undefined, false]}
                    }, {customerDeleted: true}
                ).exec(function (err, chatMessage) {
                    if (err)  return res.serverError(err);
                    res.json({result: true});
                    return res.end();
                })
            } else {
                res.json({result: false, err: errMessageType.Enums.errType.NULL_CHATROOM});
                return res.end();
            }
        })
    }

};

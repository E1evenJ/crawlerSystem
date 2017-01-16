/**
 * Created by chao on 2016/12/26.
 */

/**
 * ChatMessageController
 *
 * @description :: Server-side logic for managing Chatmessages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var co = require('co');
var SocketType = require('../enums/SocketType.js');
var errMessageType = require('../enums/ErrMessageType.js');
module.exports = {

    //呼叫
    callMessage: function (req, res) {
        var userBean = req.allParams();
        if (userBean.formUserId == undefined || userBean.toUserId == undefined || userBean.formSocketId == undefined) {
            return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_PARAM});
        }
        var userArr = [userBean.formUserId, userBean.toUserId];
        co(function*() {
            var chatRoom = yield function (callback) {
                ChatRoomService.isExist(userArr, callback);
            };
            chatRoom = JSON.parse(chatRoom);
            if (chatRoom.result == null || chatRoom.err != 0 ) {
                if (chatRoom.err != null) return res.serverError(chatRoom.err);
                return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_CHATROOM});
            }
            var chatrooms = yield function (callback) {
                ChatRoomService.isChat(userArr, callback);
            };
            chatrooms = JSON.parse(chatrooms);
            if (chatrooms.result.length != 0 || chatrooms.err != 0) {
                if (chatrooms.err != null) return res.serverError(chatrooms.err);
                return res.serverError({result: false, err: errMessageType.Enums.errType.IS_CHATTING});
            }
            sails.sockets.broadcast(chatRoom.result.id, SocketType.Enums.VideoActionType.CALL, userBean, req);
            return res.json({result: true});

        });
    },

    //接通通话
    answerMessage: function (req, res) {
        var userBean = req.allParams();
        if (userBean.formUserId == undefined || userBean.toUserId == undefined || userBean.formSocketId == undefined || userBean.toSocketId == undefined) {
            return res.json({result: false, err: errMessageType.Enums.errType.NULL_PARAM});
        }
        ;
        var userArr = [userBean.formUserId, userBean.toUserId];
        co(function*() {
            var chatRoom = yield function (callback) {
                ChatRoomService.isExist(userArr, callback);
            };
            chatRoom = JSON.parse(chatRoom);
            if (chatRoom.result == null || chatRoom.err != 0) {
                if (chatRoom.err != null) return res.serverError(chatRoom.err);
                return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_CHATROOM});
            }
            var chatrooms = yield function (callback) {
                ChatRoomService.isChat(userArr, callback);
            };
            chatrooms = JSON.parse(chatrooms);
            if (chatrooms.result.length != 0 || chatrooms.err != 0) {
                if (chatrooms.err != null) return res.serverError(chatrooms.err);
                return res.serverError({result: false, err: errMessageType.Enums.errType.IS_CHATTING});
            }
            if (!chatRoom.result.isChat) {
                ChatRoom.update({id: chatRoom.result.id}, {isChat: true}).exec(function (err, chatRoomModel) {
                    sails.sockets.broadcast(chatRoomModel[0].id, SocketType.Enums.VideoActionType.ANSWER, userBean, req);
                    return res.json({result: true});
                })
            } else {
                return res.serverError({result: false, err: errMessageType.Enums.errType.IS_CHATTING});
            }
        });
    },

    //忽略聊天
    ignoreMessage: function (req, res) {
        var userBean = req.allParams();
        if (userBean.formUserId == undefined || userBean.toUserId == undefined || userBean.formSocketId == undefined || userBean.toSocketId == undefined) {
            return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_PARAM});
        }
        ;
        var userArr = [userBean.formUserId, userBean.toUserId];
        co(function*() {
            var chatRoom = yield function (callback) {
                ChatRoomService.isExist(userArr, callback);
            };
            chatRoom = JSON.parse(chatRoom);
            if (chatRoom.result == null || chatRoom.err != 0) {
                if (chatRoom.err != null) return res.serverError(chatRoom.err);
                return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_CHATROOM});
            }
            var chatrooms = yield function (callback) {
                ChatRoomService.isChat(userArr, callback);
            };
            chatrooms = JSON.parse(chatrooms);
            if (chatRoom.result.isChat && chatRoom.result.id == chatrooms.result[0].id) {
                return res.serverError({result: false, err: errMessageType.Enums.errType.isChat});
            } else {
                sails.sockets.broadcast(chatRoom.result.id, SocketType.Enums.VideoActionType.IGNORE, userBean, req);
                return res.json({result: true});
            }
        });

    },

    //结束聊天
    finishMessage: function (req, res) {
        var userBean = req.allParams();
        if (userBean.formUserId == undefined || userBean.toUserId == undefined || userBean.formSocketId == undefined || userBean.toSocketId == undefined) {
            return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_PARAM});
        }
        ;
        var userArr = [userBean.formUserId, userBean.toUserId];
        co(function*() {
            var chatRoom = yield function (callback) {
                ChatRoomService.isExist(userArr, callback);
            };
            chatRoom = JSON.parse(chatRoom);
            if (chatRoom.result == null || chatRoom.err != 0) {
                if (chatRoom.err != null) return res.serverError(chatRoom.err);
                return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_CHATROOM});
            }
            var chatrooms = yield function (callback) {
                ChatRoomService.isChat(userArr, callback);
            };
            chatrooms = JSON.parse(chatrooms);
            if (chatrooms.result.length == 0 || chatrooms.err != 0) {
                if (chatrooms.err != null) return res.serverError(chatrooms.err);
                return res.serverError({result: false, err: errMessageType.Enums.errType.REFUSED_CHATTING});
            }
            if (chatRoom.result.isChat && chatRoom.result.id == chatrooms.result[0].id) {
                ChatRoom.update({id: chatRoom.result.id}, {isChat: false}).exec(function (err, chatRoomModel) {
                    if (err) res.serverError(err);
                    if (!chatRoomModel[0].isChat) {
                        sails.sockets.broadcast(userBean.toSocketId, SocketType.Enums.VideoActionType.FINISH_CHATTING, userBean, req);
                        return res.json({result: true});
                    }
                    return res.serverError({result: false, err: errMessageType.Enums.errType.UPDATE});
                })
            } else {
                return res.serverError({result: false, err: errMessageType.Enums.errType.REFUSED_CHATTING});
            }
        });
    },

    //呼叫未接听
    closeChat: function (req, res) {
        var userBean = req.allParams();
        if (userBean.formUserId == undefined || userBean.toUserId == undefined || userBean.formSocketId == undefined) {
            return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_PARAM});
        }
        var userArr = [userBean.formUserId, userBean.toUserId];
        console.log("closeChat===>"+userArr);
         co(function*() {
            var chatRoom = yield function (callback) {
                ChatRoomService.isExist(userArr, callback);
            };
             console.log("json===>"+chatRoom);
            chatRoom = JSON.parse(chatRoom);
             console.log("json===>"+chatRoom);
            if (chatRoom.result == null || chatRoom.err != 0) {
                if (chatRoom.err != null) return res.serverError(chatRoom.err);
                return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_CHATROOM});
            }
             console.log("broadcast===>"+chatRoom);
            sails.sockets.broadcast(chatRoom.result.id, SocketType.Enums.VideoActionType.CLOSE_CHAT, userBean, req);
            return res.json({result: true});
         });
        // ChatRoom.findOne({where:
        // {'chatUsers.userId': {$all:userArr}}
        // }).exec(function (err, chatRoom) {
        //     if (err) res.serverError(err);
        //     sails.sockets.broadcast(chatRoom.id, SocketType.Enums.VideoActionType.CLOSE_CHAT, userBean, req);
        //     return res.json({result: true});
        // });

    },
    //源数据
    rtcHandshake: function (req, res) {
        var userBean = req.allParams();
        if (userBean.tosocketId == undefined || userBean.tosocketId == null) {
            return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_PARAM});
        }
        sails.sockets.broadcast(userBean.tosocketId, SocketType.Enums.VideoActionType.PHONERTC_HANDSHAKE, userBean.data, req);
        return res.json({result: true});
    },
    //
    isChat: function (req, res) {
        var userBean = req.allParams();
        if (userBean.formUserId == undefined || userBean.toUserId == undefined) {
            return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_PARAM});
        }
        var userArr = [userBean.formUserId, userBean.toUserId];
        co(function*() {
            var chatRoom = yield function (callback) {
                ChatRoomService.isExist(userArr, callback);
            };
            chatRoom = JSON.parse(chatRoom);
            if (chatRoom.result == null || chatRoom.err != 0) {
                if (chatRoom.err != null) return res.serverError(chatRoom.err);
                return res.serverError({result: false, err: errMessageType.Enums.errType.NULL_CHATROOM});
            }
            sails.sockets.broadcast(userBean.toSocketId, SocketType.Enums.VideoActionType.IS_CHATTING, userBean, req);
            return res.json({result: true});
        });
    }

};


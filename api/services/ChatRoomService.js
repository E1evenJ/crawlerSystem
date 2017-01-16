/**
 * Created by chao on 2016/12/19.
 */

var baseSetting= require('../common/BaseSetting.js');
var co = require('co');
module.exports = {

    /*
     * 获取最小修改时间
     */
    obtainActiveTime: function(chatRoom,userId){
        for (var i in  chatRoom.chatUsers) {
            if ( chatRoom.chatUsers[i].userId ==userId && (chatRoom.chatUsers[i].lastObtainMsgTime != undefined || chatRoom.chatUsers[i].lastObtainMsgTime != null)) {
                return new Date(chatRoom.chatUsers[i].lastObtainMsgTime);
            }
        }
        return baseSetting.getMinDate();
    },
    /*
     * 获取chatRoomid
     */
    getChatRoomIds: function (chatRooms) {
        if (chatRooms != null) {
           // var ss = new String[chatRooms.size()];
            var ss = [];
            for (var i = 0; i < chatRooms.length; i++) {
                ss[i] = chatRooms[i]["_id"];
            }
            return ss;
        } else {
            return null;
        }

    },
    //修改获取消息最后时间
    updatelastObtain: function (userId) {
        ChatRoom.native(function (err, collection) {
            if (err) return res.serverError(err);
            collection.find({'chatUsers.userId': userId}, {}).toArray(function (err, chatRooms) {
                if (err) return sails.log.error(err);
                for (var i in chatRooms) {
                    var chatUser= findChatUserById(chatRooms[i].chatUsers,userId);
                    if(!chatUser) continue;
                    chatUser.lastObtainMsgTime=new Date().getTime();
                    ChatRoom.update({id:chatRooms[i]["_id"]},chatRooms[i]).exec(function (err, chatRoom) {
                        if (err) sails.log.error(err);
                    })
                }
            });
        });
    },
    isExist: function (userIdArr,callback) {
        console.log("isExist===>"+userIdArr);
        ChatRoom.findOne({where:
        {'chatUsers.userId': {$all:userIdArr}}
        }).exec(function (err, chatRoom) {
            console.log("isExist=err==>"+err);
            if (err) callback(JSON.stringify({err: err}), null);
            console.log("isExist=chatRoom==>"+chatRoom);
            if (chatRoom) callback(null,JSON.stringify({err: 0, result: chatRoom}));
        });
    },
    isChat: function (userIdArr,callback) {
        ChatRoom.find({
            where: {'chatUsers.userId': {$in: userIdArr},isChat:true}
        }).exec(function (err, chatRooms) {
            if (err) callback(JSON.stringify({err: err}), null);
            if (chatRooms) callback(null,JSON.stringify({err: 0, result: chatRooms}));
        });
    }


}
function findChatUserById(chatUsers,userId) {
    for (var i  in chatUsers) {
        if(chatUsers[i].userId == userId){
            return chatUsers[i];
        }
    }
    return null;
}

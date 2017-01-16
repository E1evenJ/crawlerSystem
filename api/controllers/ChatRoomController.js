/**
 * ChatRoomController
 *
 * @description :: Server-side logic for managing Chatrooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var userType =require('../enums/UserType.js');
module.exports = {
    createChatRoom: function (req,res) {
        var chatBean = req.body;
        if(chatBean.customerId.length == 0 || chatBean.counselorId == null){
            res.json({result:true});
            return  res.end();
        }

        var chatRoom= {chatUsers:[]};
        for(var i=0; i<chatBean.customerId.length;i++){
            var chatUser = {};
            chatUser.userId=chatBean.customerId[i];
            chatUser.type=userType.getUserType('AA');
            chatRoom.chatUsers.push(chatUser);
        }
        var chatUser = {};
        chatUser.userId=chatBean.counselorId;
        chatUser.type = userType.getUserType('AB');
        chatRoom.chatUsers.push(chatUser);
        ChatRoom.create(chatRoom).exec(function (err,chatRoom) {
            if(err) return res.serverError(err);

            if(chatRoom){
                res.json(chatRoom);
                return res.end();
            }
        })

    }

};


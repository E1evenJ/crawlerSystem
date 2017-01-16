/**
 * Created by chao on 2016/12/23.
 */

module.exports={
    Enums:Enums
}

function Enums() {
}


Enums.errType = {
    NULL_PARAM:"缺少参数",
    NULL_CHATROOM:"咨询室不存在",
    IS_CHATTING:"对方正在通话中",
    UPDATE:"咨询室错误，请重新呼叫",
    REFUSED_CHATTING:"对方已取消聊天",
    NULL_CHATMESSAGE:"消息为空"
};

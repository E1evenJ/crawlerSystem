/**
 * Created by chao on 2016/12/23.
 */

module.exports={
    Enums: Enums
}

function Enums() {
}


Enums.VideoActionType = {
    MESSAGE:'message',
    CALL: 'call',
    ANSWER: 'answer',
    IGNORE: 'ignore',
    IS_CHATTING:'isChatting',
    CLOSE_CHAT:'closeChat',
    FINISH_CHATTING:'finishChatting',
    PHONERTC_HANDSHAKE: 'phonertcHandshake',
};

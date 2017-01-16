/**
 * ChatMessage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var uuid = require('uuid');
var messageType = require('../enums/MessageType.js');
module.exports = {
    tableName: 'chatLog',
    attributes: {
        id: {
            type: 'string',
            primaryKey: true,
            unique: true,
            defaultsTo: function () {
                return uuid.v4();
            }
        },
        messageContent: {
            type: 'text',
            required: true
        },
        userId: {
            type: 'string',
            required: true
        },
        chatRoomId: {
            type: 'string',
            required: true
        },
        remark: {
            type: 'string'
        },
        createTime: {
            type: 'integer',
            required: true
        },
        messageType: {
            type: 'string',
            required: true,
            enum: messageType
        },
        customerDeleted: {
            type: 'boolean',
            defaultsTo: function () {
                return false;
            }
        }
    }
};


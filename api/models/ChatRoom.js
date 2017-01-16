/**
 * ChatRoom.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var chatRoomType = require('../enums/ChatRoomType.js');
var uuid=require('uuid');
module.exports = {

    tableName: 'ChatRoom',

    attributes: {
        id: {
            type: 'string',
            primaryKey: true,
            unique: true,
            defaultsTo: function () {
                return uuid.v4();
            }
        },
        chatUsers: {
            type: 'array',
            required: true
        },
        isNew: {
            type: 'boolean',
            required: true,
            defaultsTo: function () {
                return true;
            }
        },
        chatRoomType: {
            type: 'string',
            enum: chatRoomType
        },
        isChat:{
            type: 'boolean',
            required: true,
            defaultsTo: function () {
                return false;
            }
        },
        createId: {
            type: 'string',
        },
        createDate: {
            type: 'integer',
            required: true,
            defaultsTo: function () {
                return new Date().getTime();
            }
        },
        updateId: {
            type: 'string',
        },
        updateDate: {
            type: 'integer',
            required: true,
            defaultsTo: function () {
                return new Date().getTime();
            }
        }
    }
};


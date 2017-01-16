/**
 * ChatUser.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var userType=require('../enums/UserType.js');
module.exports = {

  attributes: {
      userId:{
          type:'string',
          required: true
      },
      type:{
          type:'string',
          required: true,
          enum:userType.userType
      },
      lastObtainMsgTime:{
          type:'integer',
          required: true
      },


  }
};


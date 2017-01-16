/**
 * Created by chao on 2016/12/19.
 */


var async = require('async');
module.exports = {

    /*
     * 来访者过滤已删除消息
     */
  filterDeleted: function (messages, userType,call) {
    if (messages.length > 0 && userType == 'USER') {
      async.reject(messages, function (item, callback) {
        callback(item.customerDeleted == true);
      }, function (results) {
          call(null,JSON.stringify({err: 0, result: results}));
      });
    } else {
       call(null,JSON.stringify({err: 0, result: messages}));
    }
  }

}

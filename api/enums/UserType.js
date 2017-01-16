/**
 * Created by chao on 2016/12/19.
 */

module.exports ={

    getUserType:function(type) {

      switch (type) {
        case 'APP_CUSTOMER':
          return 'USER';
        case 'APP_COUNSELOR':
          return 'COUNSELOR';
        case 'WEB_CUSTOMER':
          return 'USER';
        case 'WEB_COUNSELOR':
          return 'COUNSELOR';
        case 'MANAGER':
          return 'CUSTOMER_SERVICE';
        case 'WP':
         return null;
        case 'WM':
          return null;
        default:
          return null;
      }
    },
    userType:[
        /**
        * 来访者
        */
        'USER',
        /**
         * 团体
         */
        'GROUP',
        /**
         * 客服
         */
        'CUSTOMER_SERVICE',
        /**
         * 咨询师
         */
        'COUNSELOR']
}


var api = require('../../utils/api.js')

Page({
  data: {
    list: [],
    massage_count: 0,
  },
  onLoad() {



  },
  onShow() {
    let isLogin = wx.getStorageSync('login');
    if (!isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
    let user = wx.getStorageSync('user');
    this.setData({
      user: user
    });
    this.user_count()
    this.collectionlist()
    this.massage_count()
    console.log(user);
  },
  collectionlist: function() {
    api.get({
      url: 'user/favorites/my',
      data: {},
      success: data => {
        if (data.code == 1) {
          //  成功
          this.setData({
            collectionlist: data.data.list
          })


        }

        if (data.code == 0) {
          //  失败
        }
      }
    });
  },

  user_count: function() {
    api.get({
      url: 'user/profile/user_count',
      data: {},
      success: data => {
        if (data.code == 1) {
          // 发送成功
          this.setData({
            user_count: data.data
          })
        }

        if (data.code == 0) {
          // 发送失败
        }

      }
    });
  },
  massage_count: function() {
    var _this = this
    api.get({
      url: 'user/massage/massage_count',
      data: {},
      success: data => {
        if (data.code == 1) {
          this.setData({
            massage_count: data.data.count
          })
        }

        if (data.code == 0) {
          //  失败
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        }
      }
    });
  },
});
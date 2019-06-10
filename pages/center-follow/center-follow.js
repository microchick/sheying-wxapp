// pages/center-follow/center-follow.js
var api = require('../../utils/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
    if (options.to_uid){
      this.getUserFollowfans(options.to_uid)
    }else{
      this.getData();//获取我的关注列表
    }
  },
  /*获取用户关注列表*/
  getData: function () {
    var _this = this;
    api.get({
      url: 'user/Follow/getFollows',
      data: {
      },
      success: data => {
        if (data.code == 1) {
          //  成功
          console.log(data);
          _this.setData({
            list: data.data.list
          })

        }

        if (data.code == 0) {
          //  失败
        }

        console.log(data);
      }
    });


  },

  /*获取用户关注列表*/
  getUserFollowfans: function (to_uid) {
    var _this = this;
    api.get({
      url: 'user/touser/getUserFollowfans',
      data: {
        to_uid: to_uid
      },
      success: data => {
        if (data.code == 1) {
          //  成功
          console.log(data);
          _this.setData({
            list: data.data.list
          })

        }

        if (data.code == 0) {
          //  失败
        }

        console.log(data);
      }
    });


  },
  /*关注用户*/
  follow: function (e) {

    var _this = this
    var to_uid = e.currentTarget.dataset.id;

    api.post({
      url: 'user/Follow/setFollows',
      data: {
        to_uid: to_uid,

      },
      success: data => {
        if (data.code == 1) {
          //  成功

          _this.setData({
            isfollow: !_this.data.isfollow
          })
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
          _this.getData();
        }

        if (data.code == 0) {
          //  失败
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        }

        console.log(data);
      }
    });

  },
  
  /*取消关注用户*/
  unfollow: function (e) {

    var _this = this
    var to_uid = e.currentTarget.dataset.id;

    api.post({
      url: 'user/Follow/unsetFollows',
      data: {
        to_uid: to_uid,

      },
      success: data => {
        if (data.code == 1) {
          //  成功

          _this.setData({
            isfollow: !_this.data.isfollow
          })
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
          _this.getData();
        }

        if (data.code == 0) {
          //  失败
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        }

        console.log(data);
      }
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
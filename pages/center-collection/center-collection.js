// pages/center-collection/center-collection.js
var api = require('../../utils/api.js');
var app = getApp();
var user = wx.getStorageSync('user');

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
    this.list()
  },

  recomment:function(e){
    let id = e.target.dataset.id
    api.post({
      url: 'portal/articles/cancelFavorite',
      data: {
        id: id
      },
      success: data => {
        if (data.code == 1) {
          //  成功
          wx.showToast({
            title: data.msg,
            icon:'none',
          })
          this.list()
        }

        if (data.code == 0) {
          //  失败
          wx.showToast({
            title: data.msg,
            icon: 'none',
          })
        }
 
      }
    });
    
  },
  list:function(){  
    api.get({
      url: 'user/favorites/my',
      data: {
        table_name:'user'
      },
      success: data => {
        if (data.code == 1) {
          //  成功
          let list = data.data.list
          for (var index in list){

            list[index].create_time = api.timeHandle(list[index].create_time)

          }
          this.setData({ list: list})


        }

        if (data.code == 0) {
          //  失败
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
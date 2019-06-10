// pages/upload/upload-index.js
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
    this.slides();
  },
  slides: function () {
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    
    api.get({
      url: 'home/slides/4',
      data: {
      },
      success: data => {
        var slides = data.data.items
        console.log(slides)
        this.setData({
          slides: slides,
        });
        wx.hideLoading();
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
    let isLogin = wx.getStorageSync('login');
    if (!isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
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
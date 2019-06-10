// 查看消息页
var api = require('../../utils/api.js');
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
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
    this.articles(options.id);
  },  
  articles: function (id) {
    let _this =this;
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
     
    api.get({
      url: 'user/massage/massage_read',
      data: {
        id: id,
      },
      success: data => {
        if (data.code == 1) {
          //  发送成功
          let content = data.data
         // wx.setNavigationBarTitle({title: content.title})
          this.setData({ content_info: content})
          WxParse.wxParse("content", "html", content.content, _this);
          wx.hideLoading();
        }
        if (data.code == 0) {
          //  发送失败
        }
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
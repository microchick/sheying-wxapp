// pages/index/index.js
var api = require('../../utils/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    PostLists: [],
    post_id: 0,
    page: 1,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      post_id: options.post_id,
      page:1,
    });
    this.dolike_list(options.post_id);
   
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
  
   
  dolike_list: function (post_id, bottom = false) {
    let _this = this
    let page = this.data.page;
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    api.get({
      url: 'user/touser/getArticlelike',
      data: {
        object_id: post_id,
        page: page,
      },
      success: data => {
        let indexLists = _this.data.PostLists
        var PostLists = data.data.list
        let page = this.data.page + 1
        this.setData({
          PostLists: bottom ? indexLists.concat(PostLists) : PostLists,
          page: page
        });
        wx.hideLoading();
        if (PostLists.length == 0) {
          wx.showToast({
            title: '没有更多啦！',
            icon: 'none'
          });
          
        }
      }
    });
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
    let _this = this
    let post_id = _this.data.post_id
    this.dolike_list(post_id, true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
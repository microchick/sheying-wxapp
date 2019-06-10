// pages/activity/activity.js
var api = require('../../utils/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    PostLists: [],
    category_id: 1,
    page: 1,
    load_more: true,//允许加载更多
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
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
    /*  wx.showToast({
        title: '功能内测中，敬请期待',
        icon:'none'
      })
      */
    this.getCategoryPostLists();
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
    this.more_getCategoryPostLists();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
/*获取分类的活动*/
  getCategoryPostLists: function () {
    let _this = this
    let page = this.data.page;
    let category_id = this.data.category_id;
    var load_more = this.data.load_more
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });

    if (load_more == false) {/*减少被请求的次数*/
      wx.showToast({
        title: '没有更多啦！',
        icon: 'none'
      })
      return false;
    }


    api.get({
      url: 'portal/lists/getCategoryPostLists',
      data: {
        category_id: category_id,
        page: page,
        limit: 10,
        order:'-post.create_time'
      },
      success: data => {
      
        var PostLists = data.data.list
        _this.setData({
          PostLists: PostLists,
          page: page
        });
        wx.hideLoading();
        if (PostLists.length == 0) {
          wx.showToast({
            title: '没有更多啦！',
            icon: 'none'
          })
          _this.setData({
            load_more: false
          })
        }
      }
    });
  },
  /*
  *加载更多
  */
  more_getCategoryPostLists: function () {
    let _this = this
    let page = this.data.page+1;
    let category_id = this.data.category_id;
    var load_more = this.data.load_more
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });

    if (load_more == false) {/*减少被请求的次数*/
      wx.showToast({
        title: '没有更多啦！',
        icon: 'none'
      })
      return false;
    }


    api.get({
      url: 'portal/lists/getCategoryPostLists',
      data: {
        category_id: category_id,
        page: page,
        limit: 10,
        order: '-post.create_time'
      },
      success: data => {
        let indexLists = _this.data.PostLists
        var PostLists = data.data.list
        _this.setData({
          PostLists: indexLists.concat(PostLists),
          page: page,
        });
        wx.hideLoading();
        if (PostLists.length == 0) {
          wx.showToast({
            title: '没有更多啦！',
            icon: 'none'
          })
          _this.setData({
            load_more: false
          })
        }
      }
    });
  },

})
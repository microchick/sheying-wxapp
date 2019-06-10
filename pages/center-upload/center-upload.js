// pages/center-upload/center-upload.js
var api = require('../../utils/api.js');
var app = getApp();
var user = wx.getStorageSync('user');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.list() 
  }, 

  fb: function(e) {
    let _this = this
    let status = e.target.dataset.status
    let id = e.target.dataset.id
    api.post({
      url: 'portal/articles/publish',
      data: {
        id: id,
        status: status
      },
      success: data => {
        if (data.code == 1) {
          //  发送成功
          wx.showToast({
            title: data.msg,
          })
          _this.list() 
        }
        if (data.code == 0) {
          //  发送失败
          wx.showToast({
            title: data.msg,
          })
        }
      }
    });


  },

  del: function (e) {
    let _this = this
    let id = e.target.dataset.id
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          api.delete({
            url: 'portal/articles/' + id,
            data: {
            },
            success: data => {
              if (data.code == 1) {
                //  发送成功
                wx.showToast({
                  title: data.msg,
                })
                _this.list() 
              }

              if (data.code == 0) {
                //  发送失败
              }
            }
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  list:function(){
    let that = this
    api.get({
      url: 'portal/articles/my',
      data: {
        user_id: user.id,
        limit: '10000',
        order:'-create_time',
        relation:'user'
      },
      success: data => {
        if (data.code == 1) {
          //  发送成功
         
          that.setData({ list: data.data.list})
        }

        if (data.code == 0) {
          //  发送失败
        }
      }
    });

 
  },
  edit:function(e){
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: '../upload/upload?type=edit&id=' + id,
    })
  },
  onReachBottom: function () {
    this.list();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   

   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.reLaunch({
      url: '../my/my'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    
    return {
      title: options.target.dataset.name,
      path: options.target.dataset.url,
      imageUrl: options.target.dataset.img,
   }
  }
})
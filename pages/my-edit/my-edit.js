// pages/my-edit/my-edit.js
var api = require('../../utils/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['保密','男', '女'],
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
    wx.getStorage({
      key: 'user',
      success: (res) => {
        console.log(res)
        this.setData({ user: res.data });
      }
    });
  },
  formSubmit:function(e){
    let value = e.detail.value
    api.post({
      url: 'user/profile/userInfo',
      data: value,
      success: data => {
        if (data.code == 1) {
          //  成功
          console.log(data)

          wx.showToast({
            title: data.msg,
          })
          this.userInfo();  
        }

        if (data.code == 0) {
          //  失败
        }

        console.log(data);
      }
    });

    console.log(value);
  },
  userInfo:function(){
    let user = this.data.user
    api.get({
      url: 'user/profile/userInfo',
      data: { to_uid: user.id},
      success: data => {
        if (data.code == 1) {
          //  成功
          for (var index in data.data){
            user[index] = data.data[index]
          }

          wx.setStorageSync('user', user);
          this.setData({ user: data.data})
          wx.navigateBack({

          })
        }

        if (data.code == 0) {
          //  失败
        } 
      }
    });
    

  },
  bindTimeChange:function(e){
    let value = e.detail.value

    let user = this.data.user
    user.birthday = value
    this.setData({ user: user}) 

  },

  bindPickerChange(e) {
    let user = this.data.user
    user.sex = e.detail.value
    this.setData({
      user: user
    })
  },

  gotoShow: function () {
    var _this = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
        })
        // success 
        api.uploadFile({
          url: 'user/upload/one',
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            param1: 'param1'
          },//HTTP 请求中其他额外的 form data
          success: data => {
            if (data.code == 1) {

              //  成功 
              let img = api.HOST + '/upload/' + data.data.url
              let user = _this.data.user
              user.avatar = img
              _this.setData({user:user})
              console.log(img);
              wx.hideLoading()
            }

            if (data.code == 0) {
              //  失败
            }


          }
        });
        console.log(res)
        _this.setData({
          src: res.tempFilePaths
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
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
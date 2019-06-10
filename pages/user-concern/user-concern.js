// pages/user-concern/user-concern.js

var api = require('../../utils/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navitem:0,
    to_uid:0,
    page:1,
    ArticleList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({ to_uid: options.to_uid })
    this.user(options.to_uid)
  },

  navitem: function (e){
    var item = e.currentTarget.dataset.item;
    var _this=this;
    _this.setData({ page: 1 })
    _this.setData({
      ArticleList: [],
    });
    console.log(item)
    if (item==0){
      _this.userArticleList(_this.data.to_uid)
    }
    if (item == 1) {

      _this.join_game_list(_this.data.to_uid)
    }
    if (item == 2) {
      _this.join_game_prizes_list(_this.data.to_uid)
    }
    this.setData({ navitem: item})
  },

  user: function (to_uid){ 
 
    var _this = this
    api.get({
      url: 'user/touser/userInfo',
      data: {
        to_uid: to_uid, 
      },
      success: data => {
        if (data.code == 1) {
          //  成功 
          var userid = data.data.id;
          _this.userCount(userid)
          _this.userArticleList(userid)
          _this.isfollow(userid)

          let userInfo = data.data
          userInfo.to_uid = to_uid
          _this.setData({ userInfo: userInfo})
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
 /*
 *加载用户作品
 */
  userArticleList: function (bottom = false){
    var _this = this
    var to_uid = _this.data.to_uid;
    var page = _this.data.page;
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    api.get({
      url: 'user/touser/article_list',
      data: {
        to_uid: to_uid,
        page: page,
      },
      success: data => {
        if (data.code == 1) {
          //  成功 
        // _this.setData({ ArticleList: data.data.list})

          if (bottom) {
            var indexLists = _this.data.ArticleList;
          } else {
            var indexLists = [];
          }
          var PostLists = data.data.list
          let page = _this.data.page + 1
          _this.setData({
            ArticleList: bottom ? indexLists.concat(PostLists) : PostLists,
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
/*
*加载参赛作品
*/
  join_game_list: function (bottom = false) {
    var _this = this
    var to_uid = _this.data.to_uid;
    var page = _this.data.page;
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    api.get({
      url: 'user/touser/join_game_list',
      data: {
        to_uid: to_uid,
        page:page,
      },
      success: data => {
        if (data.code == 1) {
          //  成功 
          // _this.setData({ ArticleList: data.data.list})

          
          if (bottom) {
            var indexLists = _this.data.ArticleList;
          } else {
            var indexLists = [];
          }
          var PostLists = data.data.list
          let page = _this.data.page + 1
          _this.setData({
            ArticleList: bottom ? indexLists.concat(PostLists) : PostLists,
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
  /*
*加载过奖作品
*/
  join_game_prizes_list: function (bottom = false) {
    var _this = this
    var to_uid = _this.data.to_uid;
    var page = _this.data.page;
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    api.get({
      url: 'user/touser/join_game_prizes_list',
      data: {
        to_uid: to_uid,
        page: page,
      },
      success: data => {
        if (data.code == 1) {
          //  成功 
         
          if (bottom) {
            var indexLists = _this.data.ArticleList;
          } else {
            var indexLists = [];
          }
          var PostLists = data.data.list
          let page = _this.data.page + 1
          _this.setData({
            ArticleList: bottom ? indexLists.concat(PostLists) : PostLists,
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
  userCount: function (to_uid){
    var _this = this
    api.get({
      url: 'user/touser/user_count',
      data: {
        to_uid: to_uid,
      },
      success: data => {
        if (data.code == 1) {
          //  成功 
          let userInfo = _this.data.userInfo
          userInfo.count = data.data
          _this.setData({ userInfo: userInfo }) 
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
  /*判断用户是否关注*/
  isfollow: function (to_uid) {
    var _this = this 
    api.post({
      url: 'user/Follow/findFollows',
      data: {
        to_uid: to_uid,

      },
      success: data => {
        if (data.code == 1) {
          //  成功
          console.log(data);
          _this.setData({
            isfollow: data.data.isfollow
          })
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
    var url = ''
    var to_uid = e.currentTarget.dataset.id; 

    if(_this.data.isfollow){
      url = 'user/Follow/unsetFollows'
    }else{
      url = 'user/Follow/setFollows'
    }
    
    api.post({
      url: url,
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
    let _this = this
 
   // _this.userArticleList( true);

    if (_this.data.navitem == 0) {
      _this.userArticleList(true)
    }
    if (_this.data.navitem == 1) {
      _this.join_game_list(true)
    }
    if (_this.data.navitem == 2) {
      _this.join_game_prizes_list(true)
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

   

  }
})
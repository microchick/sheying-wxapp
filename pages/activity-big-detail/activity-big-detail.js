// pages/activity-detail/activity-detail.js
var api = require('../../utils/api.js');
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navitem: 0,
    
    list_status: 6,//1人气作品 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品
    game_page:1,
    load_more:true,//允许加载更多
    gameList:[],
    auto_height:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.articles(options.id);
  },

  navitem: function (e) {
    var _this = this;
    var item = e.currentTarget.dataset.item;
    var activity_state = e.currentTarget.dataset.activity_state;
    if (item == 0 && activity_state == 0) {/* 1人气作品{未入选}} 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品｛最近作品｝*/
      console.log('最近作品')
      _this.setData({ list_status: 6, game_page: 1 })
    }
    if (item == 1 && activity_state == 0) {/*1人气作品 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品*/
      console.log('全部:人气作品')
      _this.setData({ list_status: 1, game_page: 1 })
    }

    if (item == 0 && activity_state == 1) {/*1人气作品 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品*/
      console.log('入围作品')
      _this.setData({ list_status: 2, game_page: 1 })
    }
    if (item == 1 && activity_state == 1) {/*1人气作品 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品*/
      console.log('入选：人气作品')
      _this.setData({ list_status: 3, game_page: 1 })
    }

    if (item == 0 && activity_state == 2) {/*1人气作品 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品*/
      console.log('获奖作品')
      _this.setData({ list_status: 4, game_page: 1 })
    }
    if (item == 1 && activity_state == 2) {/*1人气作品 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品*/
      console.log('获奖名单')
      _this.setData({ list_status: 5, game_page: 1 })
    }
    if (item == 2 && activity_state == 2) {/*1人气作品 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品*/
      console.log('全部作品')
      _this.setData({ list_status: 6, game_page:1 })
    }
     _this.setData({ navitem: item })
    
    _this.gameList();//加载参赛作品   1人气作品 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  auto_height:function(){
    let auto_height = this.data.auto_height
    this.setData({ auto_height: !auto_height});
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
    this.more_gameList();//加载更多作品
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   /* return {
      title: '新品首发',
      path: '/pages/activity-detail/activity-detail',
      imageUrl: 'http://image.weilanwl.com/img/4x4.jpg'
    }
    */
  },
  /*加载文章*/
  articles: function (id) {
    var _this =this;
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    let imgalist = [];
    // POST请求
    api.get({
      url: 'portal/articles/read_article/',
      data: {
        id: id
      },
      success: data => {
        if (data.code == 1) {
          //  发送成功
          let list = data.data
          list.create_time = api.timeHandle(list.create_time)
          for (var index in list.more.photos) {
            imgalist.push(list.more.photos[index].url)
          }


          wx.setNavigationBarTitle({
            title: list.post_title//页面标题为路由参数
          })

          _this.setData({ list: list, imgalist: imgalist })
          WxParse.wxParse("content", "html", list.post_content, _this);
          
          if (list.activity_state == 0) {/*活动进行状态 : 0报名中 1评审中、2结束、*/
            /* 1人气作品{未入选}} 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品｛最近作品｝*/
            _this.setData({ list_status: 6 })
          }
          if (list.activity_state == 1) {/*活动进行状态 : 0报名中 1评审中、2结束、*/
            _this.setData({ list_status: 2 })
          }
          if (list.activity_state == 2) {/*活动进行状态 : 0报名中 1评审中、2结束、*/
            _this.setData({ list_status: 4 })
          }
          console.log(_this.data.list_status);
          console.log(_this.data.list_status);
          console.log(_this.data.list_status);
          console.log(_this.data.list_status);
          _this.gameList();//加载参赛作品   1人气作品 2入围作品 3人气作品 4获奖作品 5获奖名单 6全部作品
          wx.hideLoading();
        }
        if (data.code == 0) {
          //  发送失败
        }
      }
    });
  },
  /*参加比赛*/
  joinGame:function(){
    var _this =this;
    var list = _this.data.list;
    wx.redirectTo({
      url: "/pages/upload/upload?game_id=" + list.id,
      fail: function () {
      },
    });
 
  },
 /*加载参赛最近作品*/
  gameList: function () {
    var _this = this;
   var  post_id = _this.data.list.id;
    var list_status = _this.data.list_status;
    var game_page = _this.data.game_page;
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    api.get({
      url: 'portal/lists/getGamePostLists',
      data: {
        post_id: post_id,
        list_status: list_status,
        page:1
      },
      success: data => {
       
        var list = data.data.list;
        _this.setData({ 
          gameList: list,
          show_no_data_tip: 0 == list.length,
          game_page: game_page+1,
           load_more: true
         })
        
      // console.log(data);
        wx.hideLoading();
      }
    });

    
  },

  /*加载更多 加载参赛最近作品*/
  more_gameList: function () {
    var _this = this;
    var post_id = _this.data.list.id;
    var list_status = _this.data.list_status;
    var game_page = _this.data.game_page;
    var load_more = _this.data.load_more
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    if (load_more==false){/*减少被请求的次数*/
      wx.showToast({
        title: '没有更多啦！',
        icon: 'none'
      })
      return false;
    }

    api.get({
      url: 'portal/lists/getGamePostLists',
      data: {
        post_id: post_id,
        list_status: list_status,
        page:game_page
      },
      success: data => {
        
        var list = data.data.list;
        var gameList = _this.data.gameList
        _this.setData({
          gameList: gameList.concat(list),
          game_page: game_page+1,
        })
        
       // console.log(data);
        wx.hideLoading();
        if (list.length == 0) {
          wx.showToast({
            title: '没有更多啦！',
            icon: 'none'
          })
          _this.setData({
            load_more:false
          })
        }
      }
    });


  },

  /*关注用户{关注和取消}*/
  isfollow: function (e) {
    var _this = this
    var dataset = e.currentTarget.dataset
    var to_uid = dataset.id;
    var key = dataset.keyid;
    var isfollow = dataset.isfollow==1?true:false;
    var gameList = _this.data.gameList
    _this.unfollow(isfollow, to_uid);
    //  成功


    console.log(isfollow);
    console.log(!isfollow);
    gameList[key].isfollow = !isfollow
    _this.setData({
      gameList: gameList
    })

  },
  /*取消关注用户*/
  unfollow: function (isfollow, to_uid) {
    var _this = this
    var url = ''
    if (isfollow) {
      url = 'user/Follow/unsetFollows'
    } else {
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

})
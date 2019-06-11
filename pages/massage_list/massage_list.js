// pages/massage_list/massage_list.js

var api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navitem:0,
    massage_list:[],
    page: 0,
    load_more: true,//允许加载更多
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.massage_list(0,false)
  },
  massage_list: function (type, bottom=false) {

    let _this = this;
    let page = _this.data.page + 1;
    let load_more = _this.data.load_more
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
      url: 'user/massage/massage_list',
      data: {
        type: type,
        page: page,
        limit:15
      },
      success: data => {
        if (data.code == 1) {
          let massage_list = data.data.list
 
         // for (var index in massage_list) {
        //    massage_list[index].creat_time = api.timeHandle(massage_list[index].creat_time);
           /* if (massage_list[index].is_read == 0){
              _this.massage_read(massage_list[index].id)
            }
            */
        //  }
 
          //  成功 
          let indexLists = _this.data.massage_list
          var PostLists = data.data.list
          _this.setData({
            massage_list: bottom ? indexLists.concat(PostLists) : PostLists,
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
         // _this.setData({ massage_list: massage_list});
        //  console.log(massage_list);
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
  /*
  以下支持跳转，其他：关注你,系统通知是查看详情
  #4点赞你
  #3收藏你
  #2评论你
  */
  navigaotor_chick: function (e) {
    let _this = this;
    let type = e.target.dataset.type;
    console.log(type);
    let object_id = e.target.dataset.object_id
    let id = e.target.dataset.id
    if (type == 4 || type == 3 || type == 2) {// #4点赞你// #3收藏你// #2评论你
          wx.navigateTo({
            url: '../activity-detail/activity-detail?id=' + object_id
          });
    }
    if (type == 1||type == 5) {
      wx.navigateTo({
        url: '../massage_detail/massage_detail?id=' + id
      });

    }
    

  },
  
  navitem: function (e){
    this.setData({
      load_more: true,
      page:0
    })
    let type = e.target.dataset.item;
    this.massage_list(type);
    this.setData({ navitem: type})
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
    console.log("11111");
    let _this = this;
    let type = _this.data.navitem
    _this.massage_list(type, true);
  },

})
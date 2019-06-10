// pages/activity-detail/activity-detail.js
var api = require('../../utils/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgalist: [],
    comments_list_page:1,
    CommentsLists:[],
    data_count:0,//评论数
    formSubmit:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
 
    this.articles(options.id);
    this.slides(2);//广告位-》幻灯片ID：2
  },
  /*广告位*/
  slides: function (id) {
    api.get({
      url: 'home/slides/'+id,
      data: {
      },
      success: data => {

      
        var slides = data.data.items
        console.log(slides)
        this.setData({
          slides: slides,
        });
      }
    });
  },
/*
*跳转链接
*/
  dolistnavigateTo:function(e){
    var post_id = e.target.dataset.post_id;
    wx.navigateTo({
      url: '../dolike-list/dolike-list?post_id='+post_id,
    })
 
  },
  
  /** 
	 * 预览图片
	 */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imgalist // 需要预览的图片http链接列表
    })

    console.log(this.data.imgalist)
  },

   
   /*判断用户是否关注*/
  isfollow: function(e) {

    var _this = this
    var to_uid = _this.data.list.user_id;

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

  /*关注用户*/
  follow: function(e) {

    var _this = this
    var to_uid = e.currentTarget.dataset.id;
 
    api.post({
      url: 'user/Follow/setFollows',
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
  /*取消关注用户*/
  unfollow: function (e) {

    var _this = this
    var to_uid = e.currentTarget.dataset.id;

    api.post({
      url: 'user/Follow/unsetFollows',
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
   
  appreciate: function() {
    let _this = this
    api.post({
      url: 'portal/articles/doLike',
      data: {
        id: _this.data.list.id
      },
      success: data => {
        if (data.code == 1) {
          //  成功
          let list = _this.data.list
          list.post_like = Number(list.post_like) + 1
          this.setData({
            appreciate: !this.data.appreciate,
            list: list
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
  favor: function() {
    let _this = this
    api.post({
      url: 'portal/articles/doFavorite',
      data: {
        id: _this.data.list.id
      },
      success: data => {
        if (data.code == 1) {
          //  成功
          let list = _this.data.list
          list.post_favorites = Number(list.post_favorites) + 1
          this.setData({
            favor: !this.data.favor,
            list: list
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
            icon:'none'
          })
        }

        console.log(data);
      }
    }); 
  },  
  showModal: function(e) {
    var showName = e.currentTarget.dataset.modal;
    var name = e.currentTarget.dataset.name;
    var parent_id = e.currentTarget.dataset.parentid;
    var type = e.currentTarget.dataset.type;
    var modal = []
    if (type == 2) {
      modal = {
        name: '回复',
        placeholder: name,
        parent_id: parent_id
      }
    }
    this.setData({
      modalName: showName,
      modal: modal,
      formSubmit:true
    })
  },
  closeModal: function(e) {
    this.setData({
      modalName: null,
      formSubmit: true
    })
  },
  userconcern:function(){
    wx.navigateTo({
      url: '../user-concern/user-concern',
    })
  },
  ///user/comments
  comments:function(){
    var _this=this;
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    let list = this.data.list
    let comments_list_page = this.data.comments_list_page
    // POST请求
    api.get({
      url: 'user/comments',
      data: {
        object_id: list.id,
        table_name:'comment', 
        page: 1
      },
      success: data => {
        wx.hideLoading();
        if (data.code == 1) {
          //  发送成功
          let CommentsLists = _this.data.CommentsLists
          let list = data.data.list 
          for(var index in list){
             list[index].create_time = api.timeHandle(list[index].create_time);
             list[index].path = list[index].path.split(',')
          } 
         
          _this.setData({
            CommentsLists: CommentsLists.concat(_this.toTree(list)),
            comments: CommentsLists.concat(_this.toTree(list)),
            comment_count: CommentsLists.length + list.length,
            data_count: data.data.data_count,//这个是总共评论数
            comments_list_page: comments_list_page + 1
          })
        }
        if (data.code == 0) {
          //  发送失败
           
         /* wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
          */
        }

      }
    });
  },
  
  bottom_comments: function () {
    var _this = this;
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    let list = this.data.list
    let comments_list_page = this.data.comments_list_page
    // POST请求
    api.get({
      url: 'user/comments',
      data: {
        object_id: list.id,
        table_name: 'comment',
        page: comments_list_page
      },
      success: data => {
        wx.hideLoading();
        if (data.code == 1) {
          //  发送成功
          let CommentsLists = _this.data.CommentsLists
          let list = data.data.list
          for (var index in list) {
            list[index].create_time = api.timeHandle(list[index].create_time);
            list[index].path = list[index].path.split(',')
          }

          _this.setData({
            CommentsLists: CommentsLists.concat(_this.toTree(list)),
            comments: CommentsLists.concat(_this.toTree(list)),
            comment_count: CommentsLists.length + list.length,
             comments_list_page: comments_list_page + 1
          })
        }
        if (data.code == 0) {
          //  发送失败

          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }

      }
    });
  },
  //javascript  树形结构
  toTree: function(data) {
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
      delete item.children;
    });

    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    var map = {};
    data.forEach(function (item) {
      map[item.id] = item;
    });
    //        console.log(map);

    var val = [];
    data.forEach(function (item) {

      // 以当前遍历项，的pid,去map对象中找到索引的id
      var parent = map[item.parent_id];

      // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
      if (parent) {

        (parent.children || (parent.children = [])).push(item);

      } else {
        //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
        val.push(item);
      }
    });

    return val;
  },

  formSubmit: function (e) {
    let list = this.data.list

    let formSubmit = this.data.formSubmit
    if (!formSubmit){
          wx.showToast({
            title: '请不要重复提交！',
            icon:'none'
          })
          return false
    }else{
      this.setData({ formSubmit: false })
    }


    // POST请求
    api.post({
      url: 'user/comments',
      data: {
        object_id: list.id,
        table_name: 'comment',
        content: e.detail.value.content,
        parent_id: e.detail.value.parent_id,
        url: list.url
      },
      success: data => {
        if (data.code == 1) {
          //  发送成功
          wx.showToast({
            title: data.msg,
          })
          this.setData({
            modalName: null,
            comments:[],
            comments_list_page:1,
            textarea:'',
          })
         this.comments()
        }
        if (data.code == 0) {
          //  发送失败

          wx.showToast({
            title: data.msg,
            icon:'none',
          })
        }

        this.setData({ formSubmit: true })
      }
    });
  },
  articles: function (id) { 
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
          for (var index in list.more.photos){
            imgalist.push( list.more.photos[index].url)
          }


          wx.setNavigationBarTitle({
            title: list.post_title//页面标题为路由参数
          })

          this.setData({ list: list, imgalist: imgalist })
 
          this.setData({
            appreciate: list.is_dolike,
          })

          this.setData({
            favor: list.is_favorite,
          })
 

          this.comments();
          this.isfollow();//判断用户是否关注

          wx.hideLoading();
        } 
        if (data.code == 0) {
          //  发送失败
        }
      }
    });
  },
  userLikeInfo: function (e){
    var to_uid = e.currentTarget.dataset.to_uid;
    wx.navigateTo({
      url: '../user-concern/user-concern?to_uid=' + to_uid,
    })
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
var _this =this;
    _this.bottom_comments();//加载下一页
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
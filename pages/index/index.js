// pages/index/index.js
var api = require('../../utils/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories:[],
    PostLists:[],
    scrollList: [],
    ontar: 0,//默认活动公告
    is_pro_mobile: 0,//默认全部 6 手机组 7专业组
    cid:4,
    category_id:4,
    page:0,
    load_more:true,//允许加载更多
    clickCategory_nav:false,//允许加载手机组和专业组等等其他栏目组
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    //this.getCategoryPostLists()
    this.slides()
    this.categories(); 
  //  this.click_categories();//加载手机组
  },
  ontar:function(e){
    let id = e.target.dataset.id
    this.setData({ ontar: id, clickCategory_nav: false, is_pro_mobile: id,})
  },
  /*加载栏目分类：手机组 和专业组*/
  clickCategory_nav:function(e){
    let id = e.target.dataset.id
    this.setData({ ontar: id, clickCategory_nav: true, is_pro_mobile: id,})
    this.zuopin_list();

/*额外加载底部的列表start*/
    let cid = this.data.cid;
    this.setData({
      load_more: true,
      page: 0
    })
    this.getCategoryPostLists(cid);
/*额外加载底部的列表end*/

  },
/*获取手机或专业组的作品*/
  zuopin_list: function () {

    let _this = this;
    let cid = _this.data.cid;
    let game_id = _this.data.is_pro_mobile;
    if (game_id==0){

return false;
    }
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });

    api.get({
      url: 'portal/lists/getCategoryPostLists',//'portal/lists/zuopin_list',
      data: {
        category_id: cid,
        'where[picture_grouping_category_id]': game_id,
        limit: 9,
         
      },
      success: data => {
        var zuopin_list = data.data.list
        _this.setData({
          zuopin_list: zuopin_list,
        });
 
        wx.hideLoading();
        
      }
    });
  },
  navigaotor_chick:function(e){
   let id = e.target.dataset.id
   wx.navigateTo({
     url: '../activity-detail/activity-detail?id=' + id
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
    //this.categories(); 
    this.click_categories();//加载手机组
  },

  categories: function (){
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    let category_id = this.data.category_id;
    api.get({
      url: 'portal/categories/subCategories',
      data: {
        category_id: category_id
      },
      success: data => {
        var categories = data.data.categories
        this.setData({
          categories: categories,
          name: '全部',//categories[0].name
        });
        //this.getCategoryPostLists(categories[0].id);
        this.getCategoryPostLists(4);//默认4 等于全部
        wx.hideLoading();
      }
    });
  },
  slides: function () {
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    let category_id = 4;
    api.get({
      url: 'home/slides/1',
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
  /*加载栏目组 手机组和专业组*/
  click_categories: function () {
    wx.showLoading({
      title: "正在加载...",
      mask: true,
    });
    
    api.get({
      url: 'portal/categories/subCategories',
      data: {
        category_id: 5
      },
      success: data => {
        var categories = data.data.categories
        this.setData({
          click_categories: categories,
        });
        wx.hideLoading();
      }
    });
  },

  getCategoryPostLists: function (cid,bottom = false) {
    let _this = this
    let page = this.data.page+1;
    let game_id = _this.data.is_pro_mobile;
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
 
    if (game_id==0){
         var get_array = {
           category_id: cid,
           page: page,
           limit: 3,
         }
       }else{
         var get_array = {
           category_id: cid,
           page: page,
           limit: 3,
           'where[picture_grouping_category_id]': game_id,
         }
       }
      
      
     

    api.get({
      url: 'portal/lists/getCategoryPostLists',
      data: get_array,
      success: data => { 
        let indexLists = _this.data.PostLists
        var PostLists = data.data.list 
        _this.setData({
          PostLists: bottom ? indexLists.concat(PostLists) : PostLists,
          page: page
        });
        wx.hideLoading();
        if (PostLists.length == 0){
          wx.showToast({
            title: '没有更多啦！',
            icon:'none'
          })
          _this.setData({
            load_more:false
          })
        }
      }
    });
  },
  
  clickCategory:function(e){
    let cid = e.target.dataset.id
    this.setData({ name: e.target.dataset.name, page: 0, cid: cid})
    this.getCategoryPostLists(cid);
    this.zuopin_list();
    
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
    let cid = _this.data.cid
    this.getCategoryPostLists(cid,true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
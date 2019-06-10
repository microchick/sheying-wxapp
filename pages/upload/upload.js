// pages/upload/upload.js
var api = require('../../utils/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    index: 0,
    list: { more: { photos: [] } },
    cat_id:'',
    categories:[],
    game_id:0,//0代表不参赛 其余的ID都代表参赛的活动ID 
    join_categorie_id:1,//参赛的分类ID
    game_array:[],//参赛的赛事
    game_index:0,//默认参赛为0
    picture_grouping_category:[],//分类类型
    picture_grouping_categoryindex:0,//分类类型
    picture_grouping_category_id:'6',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this =this;
    if (options.game_id){
      _this.setData({ game_id: options.game_id })
    }
    _this.setData({type: options.type})
    _this.categories();
    _this.join_categories();//加载参赛赛事
    _this.picture_grouping_category_arr();//获取分组类型
    if (options.type == 'edit'){
      _this.articles(options.id)
    } 
  },
  /*绑定参赛id*/
  bindChangeGame: function (e) {
   // console.log(e);
    var _this =this;
    var gamelist = _this.data.GameLists;
    var game_id = e.detail.value;
    if (game_id ==0){
/*选择0就是默认不参赛*/
      var select_id = 0;
      console.log('不参赛');
      console.log(select_id);
    }else{
      game_id = game_id-1;
     var select_id = gamelist[game_id].id;
       console.log(gamelist[game_id].post_title);
    }
    _this.setData({ game_id: select_id, game_index: e.detail.value })
    console.log(game_id);
  }, 
   
  /*获取参赛列表*/
  join_categories: function () {
    let game_array = []
    var _this= this;
    var join_categorie_id = this.data.join_categorie_id;
    api.get({
      url: 'portal/lists/getcategorypostlists_join_game',
      data: {
        category_id: join_categorie_id,
        activity_state:0
    
      },
      success: data => {
        
        var GameLists = data.data.list
          game_array.push('不参赛');
        for (var index in GameLists) {
          game_array.push(GameLists[index].post_title)
        }
        this.setData({
          GameLists: GameLists,
          game_id: 0,
          game_array: game_array
        });
        console.log(GameLists);

        
      }
    });

  },
  /*绑定摄影分组分类*/
  bindPickerpicture_grouping_category: function (e) {
    // console.log(e);
    var _this = this;
    var list = _this.data.picture_grouping_category;
    var cat_id = e.detail.value;
    
    var select_id = list[cat_id].id;
    console.log(list[cat_id].name);
    console.log(list[cat_id].id);
    _this.setData({ picture_grouping_category_id: select_id, picture_grouping_categoryindex: e.detail.value })
   // console.log(cat_id);
  },

  BtnReturn:function(){
    wx.switchTab({
      url: '../index/index',
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
              let list = _this.data.list
              list.more.photos.push({ url: img, name: '' })
              _this.setData({list: list});
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
  bindPickerChange:function(e){
    this.setData({ cat_id: e.detail.value, index: e.detail.value})
  }, 
  delItemFn: function (e) {
    var list = this.data.list;
    var num = e.currentTarget.dataset.index;//获取data-index
    console.log(num)
    list.more.photos.splice(num, 1);
    this.setData({
      list: list
    })

    console.log(list.more.photos)
  },
  formSubmit:function(e){
    let _this = this.data
    let value = e.detail.value 
    let photos= _this.list.more.photos

    if (photos == ''){
      wx.showToast({
        title: '请上传至少一张封面图',
        icon:'none',
      }) 
      return false
    }
    let photos_urls = []
    let photos_names = []
    for (var index in photos){
      photos_urls.push(photos[index].url)
      photos_names.push(photos[index].name)
    }
  
    if (value.id){
      api.put({
        url: 'portal/articles/' + value.id,
        data: {
          id: value.id,
          categories: _this.categories[_this.index].id,
          post_title: value.post_title,
          post_content: 'post_content',
          post_excerpt: value.post_excerpt,
          photos_urls: photos_urls.join(','),
          photos_names: photos_names.join(','),
          post_status:1,
          thumbnail: photos[0].url
        },
        success: data => {
          if (data.code == 1) {
            //  发送成功
            wx.showToast({
              title: data.msg,
            })

            wx.navigateBack({})
          }

          if (data.code == 0) {
            //  发送失败
          }

          console.log(data);
        }
      });
    }else{

      if (_this.cat_id ==''){
        wx.showToast({
          title: '您没有选择类型',
          icon:'none'
        })


        return false
      }
      var game_id = value.game_id;//参加比赛的ID
      var picture_grouping_category_id = _this.picture_grouping_category_id;//摄影分类 分组类型
      api.post({
        url: 'portal/articles',
        data: {
          categories: _this.categories[_this.index].id,
          post_title: value.post_title,
          post_content: 'post_content',
          post_excerpt: value.post_excerpt,
          photos_urls: photos_urls.join(','),
          photos_names: photos_names.join(','),
          thumbnail: photos[0].url,
          game_id: game_id,
          picture_grouping_category_id: picture_grouping_category_id,

        },
        success: data => {
          if (data.code == 1) {
            //  发送成功
            wx.showToast({
              title: data.msg,
            })
            wx.navigateTo({
              url: '../center-upload/center-upload',
            })
          }

          if (data.code == 0) {
            //  发送失败
            wx.showToast({
              title: data.msg,
              icon:'none'
            })

          }

          console.log(data);
        }
      });
    }
    
 
  },
  articles:function(id){

    // POST请求
    api.get({
      url: 'user/articles/read',
      data: {
        id: id
      },
      success: data => {
        if (data.code == 1) {
          //  发送成功
          let list = data.data
          let categories = this.data.categories
          let cat_id = this.data.cat_id
          for (var index in categories){
            if (categories[index].id == list.category_info.id){
              this.setData({ cat_id: list.category_info.id, index: index})
            }
          }
          
          this.setData({list: list})
        }

        if (data.code == 0) {
          //  发送失败
        }
      }
    });
  },
  textarea:function(e){
    let _this = this
    let index = e.target.dataset.index

    let list = _this.data.list
    list.more.photos[index].name = e.detail.value
    _this.setData({ list: list });
  },
  bindtitle:function(e){
    let _this = this
    let list = _this.data.list
    list.post_title = e.detail.value
    _this.setData({ list: list });
  },
  bindexcerpt: function (e) {
    let _this = this
    let list = _this.data.list
    list.post_excerpt = e.detail.value
    _this.setData({ list: list });
  },
  categories: function () {
    let category_id = 4;
    let array = []
    api.get({
      url: 'portal/categories/subCategories',
      data: {
        category_id: category_id
      },
      success: data => {
        var categories = data.data.categories

        for (var index in categories){
          array.push(categories[index].name)
        }
        this.setData({
          categories: categories,
          cat_id: categories[0].name,
          array: array
        });
        console.log(categories);
      }
    });
  },
/*获取摄影分组类型*/
  picture_grouping_category_arr: function () {
    let category_id = 5;//摄影类型
    
    let picture_grouping_categoryarray = []
    api.get({
      url: 'portal/categories/subCategories',
      data: {
        category_id: category_id
      },
      success: data => {
        var picture_grouping_category = data.data.categories

        for (var index in picture_grouping_category) {
          picture_grouping_categoryarray.push(picture_grouping_category[index].name)
        }
        this.setData({
          picture_grouping_category: picture_grouping_category,
          picture_grouping_categoryarray: picture_grouping_categoryarray
        });
        console.log(picture_grouping_category);
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
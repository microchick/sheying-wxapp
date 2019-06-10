var api = require('../../utils/api.js');
var app = getApp();
Page({
    data: {
        systemInfo: {},
        _api: {},
        list: [],
        total: 0,
        loadingMore: false,
        noMoreData: false,
        commentContent: '',
        commentBoxFocus: false
    },
    currentPageNumber: 1,
    commentParentId: 0,
    onLoad(params) {
        this.params = params;
    },
    onShow() {
        this.pullUpLoad();
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
        this.currentPageNumber = 1;
        this.setData({
            noMoreData: false,
            noData: false
        });
        api.get({
            url: 'user/comments',
            data: {
                object_id: this.params.object_id,
                table_name: this.params.table_name
            },
            success: data => {
                let newItems = api.updatePageList('id', data.data.list, this.formatListItem, true);
                console.log(newItems);
                this.setData({
                    list: newItems
                });

                if (data.data.list.length > 0) {

                } else {
                    this.setData({
                        noMoreData: true
                    });

                    // 没有数据
                    // this.setData({
                    //     noMoreData: true,
                    //     noData: true
                    // });
                }

                wx.stopPullDownRefresh();
            }
        });
    },

    /**
     * 上拉刷新
     */
    pullUpLoad() {
        if (this.data.loadingMore || this.data.noMoreData) return;
        this.setData({
            loadingMore: true
        });
        wx.showNavigationBarLoading();

        api.get({
            url: 'user/comments',
            data: {
                page: this.currentPageNumber,
                object_id: this.params.object_id,
                table_name: this.params.table_name
            },
            success: data => {
                let newItems = api.updatePageList('id', data.data.list, this.formatListItem);
                console.log(newItems);
                this.setData({
                    list: newItems
                });
                if (data.data.list.length > 0) {
                    this.currentPageNumber++;
                } else {
                    this.setData({
                        noMoreData: true
                    });

                    // 没有数据
                    // this.setData({
                    //     noMoreData: true,
                    //     noData: true
                    // });
                }
            },
            complete: () => {
                this.setData({
                    loadingMore: false
                });
                wx.hideNavigationBarLoading();
            }
        });
    },
    formatListItem(item) {
        let createDate = new Date();
        createDate.setTime(item.create_time * 1000);
        item.create_date = createDate.format('yyyy-MM-dd hh:mm');
        console.log(item.create_date);

        if (item.to_user_id > 0) {
            let userNickname = item.to_user.user_nickname ? item.to_user.user_nickname : item.to_user.id ;
            item.content     = "@" + userNickname + " " + item.content;
        }

        item.user.user_nickname = item.user.user_nickname ? item.user.user_nickname :  item.user.id;
        return item;
    },
    onReachBottom() {
        this.pullUpLoad();
    },
    onListItemTap(e) {
        this.commentParentId = e.currentTarget.dataset.id;
        this.setData({
            commentBoxFocus: true
        });
    },
    bindCommentInput(e) {
        this.setData({
            commentContent: e.detail.value
        });
    },
    onCommentSubmitTab(e) {
        if (this.data.commentContent == '') {
            return;
        }
        api.post({
            url: 'user/comments',
            data: {
                object_id: this.params.object_id,
                table_name: this.params.table_name,
                url: JSON.stringify({"action": "portal/Article/index", "param": {"id": this.params.object_id}}),
                content: this.data.commentContent,
                parent_id: this.commentParentId
            },
            success: data => {
                if (data.code) {
                    wx.showToast({
                        title: '评论成功!',
                        icon: 'success',
                        duration: 1000
                    });
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'error',
                        duration: 1000
                    });
                }
            },
            complete: () => {
            }
        });

        this.commentParentId = 0;
    },

});

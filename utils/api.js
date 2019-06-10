import "./date";

var app = getApp();

var host = "https://wechatxcx.sywstudio.com";

var tryingLogin = false;

function commentTimeHandle(dateStr) {
  // dateStr = 2018-09-06 18:47:00" 测试时间
  //获取dataStr的秒数  打印结果--1536230820000
  var publishTime = dateStr,  
    date = new Date(publishTime * 1000), //获取dateStr的标准格式 console.log(date) 打印结果  Thu Sep 06 2018 18:47:00 GMT+0800 (中国标准时间)
    //获取dataStr的秒数  打印结果--1536230820000
    // 获取date 中的 年 月 日 时 分 秒
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  // 对 月 日 时 分 秒 小于10时, 加0显示 例如: 09-09 09:01
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  if (H < 10) {
    H = '0' + H;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }
  // console.log("年", Y); // 年 2018
  // console.log("月", M); // 月 09
  // console.log("日", D); // 日 06
  // console.log("时", H); // 时 18
  // console.log("分", m); // 分 47
  // console.log("秒", s); // 秒 00
  var nowTime = new Date().getTime() / 1000, //获取此时此刻日期的秒数
    diffValue = nowTime - publishTime,  // 获取此时 秒数 与 要处理的日期秒数 之间的差值
    diff_days = parseInt(diffValue / 86400),    // 一天86400秒 获取相差的天数 取整
    diff_hours = parseInt(diffValue / 3600),    // 一时3600秒
    diff_minutes = parseInt(diffValue / 60),
    diff_secodes = parseInt(diffValue);

  if (diff_days > 0 && diff_days < 3) {  //相差天数 0 < diff_days < 3 时, 直接返出
    return diff_days + "天前";
  } else if (diff_days <= 0 && diff_hours > 0) {
    return diff_hours + "小时前";
  } else if (diff_hours <= 0 && diff_minutes > 0) {
    return diff_minutes + "分钟前";
  } else if (diff_secodes < 60) {
    if (diff_secodes <= 0) {
      return "刚刚";
    } else {
      return diff_secodes + "秒前";
    }
  } else if (diff_days >= 3 && diff_days < 30) {
    return M + '-' + D + ' ' + H + ':' + m;
  } else if (diff_days >= 30) {
    return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
  }
}
module.exports = {
  timeHandle: commentTimeHandle,
    HOST: host,
    API_ROOT: host + '/api/index.php/',
    API_VERSION: '1.1.0',
    post(options) {
        this.request(options);
    },
    get(options) {
        options.method = 'GET';
        this.request(options);
    },
    delete(options) {
        options.method = 'DELETE';
        this.request(options);
    },
    put(options) {
        options.method = 'PUT';
        this.request(options);
    },
    request(options) {
        var apiRoot = this.API_ROOT;
        var token   = '';
        try {
            token = wx.getStorageSync('token')
        } catch (e) {
            // Do something when catch error
        }

        var requireLogin = true;

        if (typeof options.login == 'undefined' || options.login == true) {
            requireLogin = true;
        } else {
            requireLogin = false;
        }

        wx.request({
            url: apiRoot + options.url,
            data: options.data,
            method: options.method ? options.method : 'POST',
            header: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                'XX-Token': token,
                'XX-Device-Type': 'wxapp',
                'XX-Api-Version': this.API_VERSION
            },
            success: res => {
                var data = res.data;
                if (data.code == 10001 && requireLogin) {

                    if (!tryingLogin) {
                        tryingLogin        = true;
                        var hasGetUserInfo = wx.getStorageSync('hasGetUserInfo');
                        if (hasGetUserInfo) {
                            wx.showToast({
                                title: '正在重新登录',
                                icon: 'success',
                                duration: 1000
                            });
                            setTimeout(() => {
                                this.login();
                            }, 1000);
                        } else {
                            this.login();
                        }

                    }
                    // 登录注册
                    let currentPages = getCurrentPages();

                    console.log('-------no login!---------');

                    let currentRoute = currentPages.pop()['__route__'];
                    if (currentRoute != 'pages/login/login') {
                        wx.navigateTo({
                            url: '/pages/login/login'
                        });
                    }

                } else {
                    options.success(data);
                }

            },
            fail: function (res) {
                if (options.fail) {
                    options.fail(res)
                }
            },
            complete: options.complete ? options.complete : null
        });
    },
    login: function () {
        wx.login({
            success: loginRes => {
                console.log(loginRes);
                if (loginRes.code) {
                    wx.getUserInfo({
                        withCredentials: true,
                        success: res => {
                            console.log(res);
                            wx.setStorageSync('hasGetUserInfo', '1');
                            this.post({
                                url: 'wxapp/public/login',
                                data: {
                                    code: loginRes.code,
                                    encrypted_data: res.encryptedData,
                                    iv: res.iv,
                                    raw_data: res.rawData,
                                    signature: res.signature
                                },
                                success: data => {
                                    if (data.code == 1) {
                                        wx.showToast({
                                            title: '登录成功!',
                                            icon: 'success',
                                            duration: 1000
                                        });

                                        try {
                                            wx.setStorageSync('login', '1');
                                            wx.setStorageSync('token', data.data.token);
                                            wx.setStorageSync('user', data.data.user);
                                        } catch (e) {
                                        }

                                        setTimeout(function () {
                                            wx.switchTab({
                                                url: '/pages/index/index',
                                                success: res => {
                                                    getCurrentPages()[0].onPullDownRefresh()
                                                }
                                            });
                                        }, 1000);
                                    }

                                },
                                complete: () => {
                                    tryingLogin = false;
                                }
                            });
                        },
                        fail: (res) => {
                            console.log(res);
                            tryingLogin = false;
                            if (res.errMsg == "getUserInfo:cancel" || res.errMsg == "getUserInfo:fail auth deny") {
                                wx.showModal({
                                    title: '用户授权失败',
                                    showCancel: false,
                                    content: '请删除此小程序重新授权!',
                                    success: function (res) {
                                        if (res.confirm) {
                                            console.log('用户点击确定')
                                        }
                                    }
                                });
                            }

                        }
                    });


                } else {
                    tryingLogin = false;
                }
            },
            fail: () => {
                tryingLogin = false;
            }
        });
    },
    uploadFile(options) {

        options.url = this.API_ROOT + options.url;

        let token = this.getToken();

        let that = this;

        let oldSuccess  = options.success;
        options.success = function (res) {
            console.log(res.data);
            let data = JSON.parse(res.data);
            console.log(data);
            if (data.code == 0 && data.data && data.data.code && data.data.code == 10001) {
                // wx.navigateTo({
                //     url: '/pages/login/login'
                // });
                that.login();
            } else {
                oldSuccess(data);
            }
        }

        options.header = {
            'Content-Type': 'multipart/form-data',
            'XX-Token': token,
            'XX-Device-Type': 'wxapp',
            'XX-Api-Version': this.API_VERSION
        };
        wx.uploadFile(options);

    },
    getToken() {
        var token = '';
        try {
            token = wx.getStorageSync('token')
        } catch (e) {
            // Do something when catch error
        }

        return token;
    },
    json2Form(json) {
        var str = []
        for (var p in json) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]))
        }
        return str.join("&")
    },
    timeFormat(second, fmt) {
        let mDate = new Date();
        mDate.setTime(second * 1000);
        return mDate.Format(fmt);
    },
    getCurrentPageUrl() {
        let currentPages = getCurrentPages();
        let currentPage  = currentPages.pop();
        let page         = currentPage['__route__'];
        let pageParams   = [];

        if (currentPage.params) {
            for (let key in currentPage.params) {
                pageParams.push(key + "=" + currentPage.params[key]);
            }
        }

        if (pageParams.length > 0) {
            page = page + '?' + pageParams.join("&");
        }

        return page;
    },
    /**
     *
     * @param itemKey
     * @param newItems
     * @param formatCallback
     * @param replace
     * @param listKey
     * @returns {Array}
     */
    updatePageList(itemKey, newItems, formatCallback, replace, listKey) {
        let page = this.getCurrentPageUrl();

        console.log(page + "ddd");

        return this.updatePageListByPage(page, itemKey, newItems, formatCallback, replace, listKey);
    },
    /**
     *
     * @param page
     * @param itemKey
     * @param newItems
     * @param formatCallback
     * @param replace
     * @param listKey
     * @returns {Array}
     */
    updatePageListByPage(page, itemKey, newItems, formatCallback, replace, listKey) {
        listKey = listKey ? listKey : 'list';

        console.log(page);

        if (!app.pagesData.hasOwnProperty(page)) {
            app.pagesData[page] = {};
        }

        if (!app.pagesData[page][listKey] || replace) {
            app.pagesData[page][listKey] = {};
        }

        if (newItems) {
            newItems.forEach(item => {
                let uniqueValue = '_' + item[itemKey];
                if (formatCallback && typeof formatCallback == "function") {
                    item = formatCallback(item);
                }
                app.pagesData[page][listKey][uniqueValue] = item;
            });
        }


        let list = [];

        for (let key in app.pagesData[page][listKey]) {
            list.push(app.pagesData[page][listKey][key]);
        }

        console.log(list);

        return list;
    },
    /**
     *
     * @param key
     * @param newItem
     * @param listKey
     * @returns {*|Array}
     */
    updatePageListItem(key, newItem, formatCallback, listKey) {
        let page = this.getCurrentPageUrl();

        return this.updatePageListItemByPage(page, key, newItem, formatCallback, listKey);
    },
    /**
     *
     * @param page
     * @param key
     * @param newItem
     * @param listKey
     * @returns {Array}
     */
    updatePageListItemByPage(page, key, newItem, formatCallback, listKey) {
        listKey = listKey ? listKey : 'list';

        if (!app.pagesData.hasOwnProperty(page)) {
            app.pagesData[page] = {};
        }

        if (!app.pagesData[page][listKey]) {
            app.pagesData[page][listKey] = {};
        }

        if (formatCallback && typeof formatCallback == "function") {
            newItem = formatCallback(newItem);
        }

        key = '_' + key;

        app.pagesData[page][listKey][key] = Object.assign(app.pagesData[page][listKey][key], newItem);


        let list = [];

        for (let key in app.pagesData[page][listKey]) {
            list.push(app.pagesData[page][listKey][key]);
        }

        console.log(list);

        return list;
    },
    /**
     *
     * @param key
     * @param listKey
     * @returns {*|Array}
     */
    deletePageListItem(key, listKey) {
        let page = this.getCurrentPageUrl();

        return this.deletePageListItemByPage(page, key, listKey);
    },
    /**
     *
     * @param page
     * @param key
     * @param listKey
     * @returns {Array}
     */
    deletePageListItemByPage(page, key, listKey) {
        listKey = listKey ? listKey : 'list';

        if (!app.pagesData.hasOwnProperty(page)) {
            app.pagesData[page] = {};
        }

        if (!app.pagesData[page][listKey]) {
            app.pagesData[page][listKey] = {};
        }

        key = '_' + key;

        delete app.pagesData[page][listKey][key];


        let list = [];

        for (let key in app.pagesData[page][listKey]) {
            list.push(app.pagesData[page][listKey][key]);
        }

        console.log(list);

        return list;
    },
    pageNeedUpdate(page, needUpdate) {
        app.pagesNeedUpdate[page] = needUpdate;
    },
    getUploadUrl(file) {
        if (file && file.indexOf('http') === 0) {
            return file;
        }
        return this.HOST + '/upload/' + file;
    }

};

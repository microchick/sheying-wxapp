// 引入 api 类库
var api = require('../../utils/api.js');

Page({
    onLoad() {
        try {
            var isLogin = wx.getStorageSync('login');
            if (!isLogin) {
                api.login();
                return;
            }
        } catch (e) {
            // Do something when catch error
        }

    },
    onShow() {
        // GET请求，加载文章列表
        api.get({
            url: 'portal/articles',
            data: {
                page: 1,
                order:'-published_time'
            },
            success: data => {
                console.log("文章列表数据：");
                console.log(data);

            },
            complete: () => {

            }
        });

        // POST请求，发送手机验证码
        api.post({
            url: 'user/verification_code/send',
            data: {username: '15121000000'},
            success: data => {
                if (data.code == 1) {
                    //  发送成功
                }

                if (data.code == 0) {
                    //  发送失败
                }

                console.log(data);
            }
        });
    }
});
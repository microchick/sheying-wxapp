var api = require('../../utils/api.js');
Page({
    data: {},
    onLoad () {
    },
    formSubmit(e){
        api.post({
            url: 'user/public/passwordReset',
            data: e.detail.value,
            success: data => {
                if (data.code == 1) {
                    wx.showToast({
                        title: data.msg,
                        icon: 'success',
                        duration: 1000
                    });
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 1000);
                }

                if (data.code == 0) {
                    wx.showModal({
                        content: data.msg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            }
                        }
                    });
                }


                console.log(data);
            }
        });
        //console.log(e);
    },
    onAccountInput(e){
        this.account = e.detail.value;
    },
    onGetVerificationCode(){
        api.post({
            url: 'user/verification_code/send',
            data: {username: this.account},
            success: data => {
                if (data.code == 1) {
                    wx.showModal({
                        content: data.msg,
                        showCancel: false,
                        success: function (res) {
                        }
                    });

                }

                if (data.code == 0) {
                    wx.showModal({
                        content: data.msg,
                        showCancel: false,
                        success: function (res) {
                        }
                    });
                }


                console.log(data);
            }
        });
    }
})

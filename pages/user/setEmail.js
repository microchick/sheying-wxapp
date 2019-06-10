var api = require('../../utils/api.js')

Page({
    data: {},
    onLoad (params) {
        //console.log(options);
        this.params = params;
    },

    formSubmit(e){
        api.post({
            url: 'user/profile/bindingEmail',
            data: e.detail.value,
            success: data => {
                if (data.code == 1) {
                    wx.showToast({
                        title: data.msg,
                        icon: 'success',
                        duration: 1000
                    })
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
                    })
                }


                console.log(data);
            }
        });
        //console.log(e);
    },
    onEmailInput(e){
        this.email = e.detail.value;
    },
    onGetVerificationCode(){
        api.post({
            url: 'user/verification_code/send',
            data: {username: this.email},
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


});
/**
 *   支付相关服务
 */
const util = require('../utils/util.js')

function payOrder(orderId){
    return new Promise(function(resolve, reject) {
        util.request(url, {         //走支付接口
            orderId: orderId,
			type: 1
        }).then(res=>{
            const payParam = res.data;
            wx.requestPayment({      //调用微信支付
                timeStamp: '',
                nonceStr: '',
                package: '',
                signType: '',
                paySign: '',
                success: function (res) {
                    resolve(res)
                },
                fail: function(res) {
                    reject(res)
                },
                complete: function(res) {
                    reject(res)
                }
            })
        })
    })
}

module.exports = {
    payOrder
}
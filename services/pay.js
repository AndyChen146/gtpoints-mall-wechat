/**
 *   支付相关服务
 */
import { request } from '../utils/util.js'

function payOrder(orderId){
    return new Promise(function(resolve, reject) {
        request(url, {         //走支付接口
            orderId: orderId
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